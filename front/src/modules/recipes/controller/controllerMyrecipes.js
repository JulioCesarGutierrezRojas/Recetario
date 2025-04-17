import axios from 'axios';

const getToken = () => localStorage.getItem('token');

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

export const updateRecipe = async (recipeId, recipeData) => {
    try {
      const token = getToken();
      const formData = new FormData();
      
  
      formData.append('name', recipeData.name);
      formData.append('process', recipeData.process);
      formData.append('serving_council', recipeData.serving_council);
      
      
      if (recipeData.image instanceof File) {
        formData.append('image', recipeData.image);
      } else if (typeof recipeData.image === 'string') {
        
      }
      
     
      const ingredientsData = recipeData.ingredients.map(ing => ({
        name: ing.name,
        quantity: ing.quantity
      }));
      
      formData.append('ingredients', JSON.stringify(ingredientsData));
  
      const response = await axios.put(
        `http://localhost:8000/api/recipes/${recipeId}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error("Error al actualizar receta:", {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error;
    }
  };

  export const deleteRecipe = async (recipeId) => {
    try {
      const token = getToken();
      await axios.delete(`http://localhost:8000/api/recipes/${recipeId}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return true;
    } catch (error) {
      console.error("Error al eliminar receta:", error);
      throw error;
    }
  };