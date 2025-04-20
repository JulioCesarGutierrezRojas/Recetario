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

    // Mezclar calificaciones con los comentarios
    const enrichedComments = comments.map(comment => {
      const matchingRating = ratings.find(r => r.user === comment.user && r.recipe === comment.recipe);
      return {
        ...comment,
        rating: matchingRating?.calification || 0
      };
    });

    return enrichedComments;
  } catch (error) {
    console.error("Error fetching comments/ratings:", error);
    return [];
  }
};



export const createComment = async (recipeId, comment, rating) => {
  try {
   
    const userId = parseInt(localStorage.getItem('userId'), 10);

    const commentData = {
      recipe: parseInt(recipeId, 10),
      user: userId,
      comment: comment.trim()
    };

    const response = await handleRequest('post', 'comments/', commentData);

    if (rating && rating > 0) {
      const ratingData = {
        recipe: parseInt(recipeId, 10),
        user: userId,
        calification: rating * 1 
      };
      await handleRequest('post', 'ratings/', ratingData);
    }

    return response;
  } catch (error) {
    console.error('Error al crear comentario/rating:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    throw error;
  }
};
  