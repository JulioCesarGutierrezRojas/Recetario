import { handleRequest } from '../../../config/http-client.gateway.js';

export const getCommentsByRecipe = async (recipeId) => {
  try {
    if (!recipeId) {
      console.error("recipeId is required");
      return [];
    }

    const [commentsResponse, ratingsResponse] = await Promise.all([
      handleRequest('get', `comments/?recipe=${recipeId}`),
      handleRequest('get', `ratings/?recipe=${recipeId}`)
    ]);

    const comments = commentsResponse?.data || commentsResponse?.result || commentsResponse || [];
    const ratings = ratingsResponse?.data || ratingsResponse?.result || ratingsResponse || [];

    // No need to filter as the API should already return only the comments and ratings for this recipe

    // Mezclar calificaciones con los comentarios y extraer solo los campos necesarios
    const enrichedComments = comments.map(comment => {
      const matchingRating = ratings.find(r => r.user === comment.user);

      // Extract only the required fields from comments and ratings
      return {
        id: comment.id,
        comment: comment.comment, // Keep original field for compatibility
        text: comment.comment, // Add text field for compatibility
        created_at: comment.created_at,
        recipe: comment.recipe,
        user: comment.user,
        rating: matchingRating?.calification || 0, // Add rating field for compatibility
        calification: matchingRating?.calification || 0 // Keep original field for compatibility
      };
    });

    // Añadir calificaciones que no tienen comentarios asociados
    const commentUserIds = comments.map(comment => comment.user);
    const standaloneRatings = ratings
      .filter(rating => !commentUserIds.includes(rating.user))
      .map(rating => {
        return {
          id: `rating-${rating.id}`, // Unique ID for standalone ratings
          comment: "", // Empty comment
          text: "", // Empty text
          created_at: rating.created_at || new Date().toISOString(),
          recipe: rating.recipe,
          user: rating.user,
          rating: rating.calification || 0,
          calification: rating.calification || 0,
          isRatingOnly: true // Flag to identify standalone ratings
        };
      });

    // Combinar comentarios enriquecidos con calificaciones independientes
    const allReviews = [...enrichedComments, ...standaloneRatings];

    // Ordenar por fecha de creación (más recientes primero)
    const sortedReviews = allReviews.sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });

    return sortedReviews;
  } catch (error) {
    console.error("Error fetching comments/ratings:", error);
    return [];
  }
};



export const createComment = async (recipeId, comment, rating) => {
  try {
    const userId = parseInt(localStorage.getItem('user-id'), 10);
    const username = localStorage.getItem('user') || "Usuario";

    const commentData = {
      recipe: parseInt(recipeId, 10),
      user: userId,
      comment: comment.trim()
    };

    const response = await handleRequest('post', 'comments/', commentData);

    // Get the created comment data
    const commentResponse = response?.result || response;

    // Create rating if provided
    if (rating && rating > 0) {
      const ratingData = {
        recipe: parseInt(recipeId, 10),
        user: userId,
        calification: rating * 1 
      };
      await handleRequest('post', 'ratings/', ratingData);
    }

    // Return an enriched comment object with only the required fields
    return {
      id: commentResponse.id || Date.now(), // Use the actual ID or a timestamp as fallback
      user: userId,
      recipe: parseInt(recipeId, 10),
      comment: comment.trim(), // Required field
      text: comment.trim(), // Add text property for compatibility
      rating: rating, // Add rating property for compatibility
      calification: rating, // Required field for ratings
      created_at: new Date().toISOString(), // Required field
    };
  } catch (error) {
    console.error('Error al crear comentario/rating:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    throw error;
  }
};
