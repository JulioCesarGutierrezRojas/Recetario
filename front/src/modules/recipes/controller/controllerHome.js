import { handleRequest } from '../../../config/http-client.gateway.js';

export const getAllRecipes = async () => {
    try {
      const response = await handleRequest('get', 'recipes/');
      return response.result || [];
    } catch (error) {
      console.error("Error en getRecipes:", error);
      return [];
    }
};