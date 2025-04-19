import { handleRequest } from '../../../config/http-client.gateway.js';

export const getRecipes = async () => {
    try {
      const response = await handleRequest('get', 'recipes/');
      return response.result || [];
    } catch (error) {
      console.error("Error en getRecipes:", error);
      return [];
    }
};

export const getComments= async () => {
    try {
      const response = await handleRequest('get', 'comments/');
      return response.result || [];
    } catch (error) {
      console.error("Error en getComments:", error);
      return [];
    }
};

export const getRatings = async () => {
    try {
      const response = await handleRequest('get', 'ratings/');
      return response.result || [];
    } catch (error) {
      console.error("Error en getRatings:", error);
      return [];
    }
};


