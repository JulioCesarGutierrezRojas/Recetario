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


export const updateRecipe = async (id, recipeData) => {
  return await handleRequest('put', `/recipes/${id}/`, recipeData);
};

export const deleteRecipe = async (id) => {
  return await handleRequest('delete', `/recipes/${id}/`);
};

export const associateIngredients = async (recipeId, ingredients) => {
  return await handleRequest('post', '/recipes/', {
    recipe: recipeId,
    ingredients: ingredients
  });
};