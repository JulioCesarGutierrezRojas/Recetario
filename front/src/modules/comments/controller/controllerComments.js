import { handleRequest } from '../../../config/http-client.gateway.js';

export const getCommentsByRecipe = async (recipeId) => {
  try {
    if (!recipeId) {
      console.error("recipeId is required");
      return [];
    }
    
    const response = await handleRequest('get', `comments/?recipe=${recipeId}`);
  
    if (Array.isArray(response)) {
      return response.filter(comment => comment.recipe == recipeId);
    } else if (Array.isArray(response?.data)) {
      return response.data.filter(comment => comment.recipe == recipeId);
    } else if (Array.isArray(response?.result)) {
      return response.result.filter(comment => comment.recipe == recipeId);
    }
    
    console.error("Formato de respuesta inesperado:", response);
    return [];
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
};


//Esta es la que se usa -----------------------------
export const createComment = async (recipeId, comment, rating) => {
  try {
   
    const userId = parseInt(localStorage.getItem('userId'), 10);

    // Enviar comentario
    const commentData = {
      recipe: parseInt(recipeId, 10),
      user: userId,
      comment: comment.trim()
    };

    const response = await handleRequest('post', 'comments/?user=me', commentData);

    // Enviar rating solo si se proporciona
    if (rating && rating > 0) {
      const ratingData = {
        recipe: parseInt(recipeId, 10),
        user: userId,
        calification: rating * 1 // Convertir de 5 a 10
      };
      await handleRequest('post', 'ratings/?user=me', ratingData);
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
  
export const getRecipeRating = async (recipeId) => {
  try {
    const response = await handleRequest('get', `ratings/?recipe=${recipeId}`); 
    
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.result)) return response.result;
    
    console.error("Formato inesperado:", response);
    return [];
  } catch (error) {
    console.error("Error obteniendo ratings:", error);
    return [];
  }
};

export const updateComment = async (commentId, commentData) => {
 
  try {
    const response = await handleRequest('put', `comments/${commentId}/`, commentData);
    return response;
  } catch (error) {
    console.error('Error actualizando comentario:', error);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
 
  try {
    const response = await handleRequest('delete', `comments/${commentId}/`);
    return response;
  } catch (error) {
    console.error('Error eliminando comentario:', error);
    throw error;
  }
};

//es update
export const postRating = async (ratingId, newRatingValue, recipeId) => {
  try {
    const userId = parseInt(localStorage.getItem('userId'), 10);
    
    const ratingData = {
      calification: newRatingValue * 2,
      recipe: parseInt(recipeId, 10),
      user: userId
    };

    const response = await handleRequest('put', `ratings/${ratingId}/`, ratingData);
    return response;
  } catch (error) {
    console.error('Error al actualizar rating:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    throw error;
  }
};

export const deleteRating = async (ratingId) => {

  try {
    const response = await handleRequest('delete', `ratings/${ratingId}/`);
    return response;
  } catch (error) {
    console.error('Error eliminando rating:', error);
    throw error;
  }
};
