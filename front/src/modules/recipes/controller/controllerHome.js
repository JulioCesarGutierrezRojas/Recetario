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

export const searchRecipes = async (query) => {
    try {
      // First try to get all recipes
      const allRecipes = await getAllRecipes();

      // If query is empty, return all recipes
      if (!query || query.trim() === '') {
        return allRecipes;
      }

      // Filter recipes based on the query (case insensitive)
      const normalizedQuery = query.toLowerCase().trim();
      return allRecipes.filter(recipe => 
        recipe.name.toLowerCase().includes(normalizedQuery) || 
        (recipe.process && recipe.process.toLowerCase().includes(normalizedQuery)) ||
        (recipe.ingredients && recipe.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(normalizedQuery)
        ))
      );
    } catch (error) {
      console.error("Error en searchRecipes:", error);
      return [];
    }
};

export const getAllRatings = async () => {
  try {
    const response = await handleRequest('get', 'ratings/');
    console.log("Ratings API response:", response);

    // Extract only the required fields from each rating
    const ratings = (response.result || []).map(rating => ({
      calification: rating.calification,
      created_at: rating.created_at,
      recipe: rating.recipe
    }));

    return ratings;
  } catch (error) {
    console.error("Error en getAllRatings:", error);
    return [];
  }
};

export const getRatingsByRecipe = async (recipeId) => {
  try {
    if (!recipeId) {
      console.error("recipeId is required");
      return [];
    }

    const response = await handleRequest('get', `ratings/?recipe=${recipeId}`);
    console.log(`Ratings for recipe ${recipeId} API response:`, response);

    // Extract only the required fields from each rating
    const ratings = (response.result || []).map(rating => ({
      calification: rating.calification,
      created_at: rating.created_at,
      recipe: rating.recipe
    }));

    return ratings;
  } catch (error) {
    console.error(`Error en getRatingsByRecipe for recipe ${recipeId}:`, error);
    return [];
  }
};

// Helper function to calculate average rating for a recipe
export const calculateAverageRating = (ratings, recipeId) => {
  // Filter ratings for this recipe if recipeId is provided
  const recipeRatings = recipeId 
    ? ratings.filter(r => r.recipe === recipeId)
    : ratings;

  // Calculate average rating
  let averageRating = 0;
  if (recipeRatings.length > 0) {
    const totalRating = recipeRatings.reduce(
      (sum, r) => sum + (typeof r.calification === "number" ? r.calification : 0), 
      0
    );
    averageRating = totalRating / recipeRatings.length;
  }

  return averageRating;
};
