import axios from 'axios';
import { handleRequest } from '../../../config/http-client.gateway.js';


// Función para obtener ingredientes existentes

export const getIngredients = async () => {
  try {
    const response = await handleRequest('get', '/recipes/');
    return response.data; 
  } catch (error) {
    console.error("Error al obtener ingredientes:", error);
    throw error;
  }
};


// Crear ingrediente
export const createIngredient = async (ingredientName, ingredientQuantity) => {
  try {
    return await handleRequest('post', '/recipes/', {
      name: ingredientName,
      quantity: ingredientQuantity
    });
  } catch (error) {
    console.error("Error al crear ingrediente:", error);
    throw error;
  }
};

// Crear receta
export const createRecipe = async (formData) => {
  return await handleRequest('post', '/recipes/', formData);
};

// Asociar ingredientes con receta
export const associateIngredientsWithRecipe = async (recipeId, ingredients) => {
  try {
    for (let ingredient of ingredients) {
      await handleRequest('post', '/recipe_ingredients/', {
        recipe: recipeId,
        ingredient: ingredient.id,
        quantity: ingredient.quantity
      });
    }
  } catch (error) {
    console.error("Error al asociar ingredientes:", error);
    throw error;
  }
};


