import axios from 'axios';

// Obtener el token de localStorage
const getToken = () => localStorage.getItem('token'); 

// Función para obtener ingredientes existentes
export const getIngredients = async () => {
  try {
    const token = getToken();
    const response = await axios.get("http://localhost:8000/api/recipes/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error al obtener los ingredientes:", error.response?.status, error.response?.data);
    throw error;
  }
};


// Función para crear un nuevo ingrediente
export const createIngredient = async (ingredientName, ingredientQuantity) => {
  try {
    const token = getToken(); 
    const response = await axios.post(
      "http://localhost:8000/api/recipes/", 
      {
        name: ingredientName,
        quantity: ingredientQuantity
      },
      {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Detalles del error:", error.response.data);
    } else {
      console.error("Error al crear ingrediente:", error.message);
    }
    throw error;
  }
};



// Función para crear una receta
export const createRecipe = async (formData) => {
  try {
    const token = getToken();  
    const response = await axios.post(
      "http://localhost:8000/api/recipes/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,  
        },
      }
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
    const token = getToken();  
    for (let ingredient of ingredients) {
      await axios.post(
        "http://localhost:8000/api/recipe_ingredients/",
        {
          recipe: recipeId,
          ingredient: ingredient.id,
          quantity: ingredient.quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
    }
  } catch (error) {
    console.error("Error al asociar ingredientes con la receta:", error);
    throw error;
  }
};

export const getRecipes = async () => {
  try {
    const token = getToken();
    const response = await axios.get("http://localhost:8000/api/recipes/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener las recetas:", error.response?.status, error.response?.data);
    throw error;
  }
};

