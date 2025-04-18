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

export const getAllRatings = async () => {
  try {
    const response = await handleRequest('get', 'ratings/');
    console.log("Ratings API response:", response);
    return response.result || [];
  } catch (error) {
    console.error("Error en getAllRatings:", error);
    return [];
  }
};