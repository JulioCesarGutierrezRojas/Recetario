import axios from 'axios';


// Función para obtener ingredientes existentes
export const getIngredients = async () => {
  try {
    const response = await axios.get("http://localhost:8000/api/ingredients/");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los ingredientes:", error);
    throw error;
  }
};


// Función para crear un nuevo ingrediente
export const createIngredient = async (ingredientName) => {
  try {
    const response = await axios.post("http://localhost:8000/api/ingredients/", {
      name: ingredientName,
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear ingrediente:", error);
    throw error;
  }
};


// Función para crear una receta
export const createRecipe = async (formData) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/api/recipes/",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  } catch (error) {
    console.error("Error al crear receta:", error);
    throw error;
  }
};


// Función para asociar ingredientes con la receta
export const associateIngredientsWithRecipe = async (recipeId, ingredients) => {
  try {
    for (let ingredient of ingredients) {
      await axios.post("http://localhost:8000/api/recipe_ingredients/", {
        recipe: recipeId,
        ingredient: ingredient.id,
        quantity: ingredient.quantity,
      });
    }
  } catch (error) {
    console.error("Error al asociar ingredientes con la receta:", error);
    throw error;
  }
};
