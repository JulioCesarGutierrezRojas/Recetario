import { handleRequest } from "../../../config/http-client.gateway";

export const RecipeController = {
  async getRecipes() {
    return await handleRequest('get', '/recipes/');
  },

  async createRecipe(payload) {
    const response = await handleRequest('post', '/recipes/', payload);
    if (response.type !== 'SUCCESS') {
      throw new Error("Error al crear la receta: ");
    }
    console.log("desde el controller", response);
    return response;
  },

  async updateRecipe(id, payload) {
    const response = await handleRequest('put', `/recipes/${id}/`, payload);
    if (response.type !== 'SUCCESS') {
      throw new Error("Error al actualizar la receta: ");
    }
    console.log("desde el controller update", response);
    return response;
  },

  async deleteRecipe(id) {
    const response = await handleRequest('delete', `/recipes/${id}/`);
    if (response.type !== 'SUCCESS') {
      throw new Error("Error al eliminar la receta: ");
    }
    console.log("desde el controller delete", response);
    return response;
  },
};
