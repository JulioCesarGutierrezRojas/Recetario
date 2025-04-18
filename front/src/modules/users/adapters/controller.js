import { handleRequest } from "../../../config/http-client.gateway";

export const UserController = {
  // obtenerlos
  async getUsers() {
    return await handleRequest('get', '/users');
  },

  // crear 
  async createUser(payload) {
    const response = await handleRequest('post', '/users/register/', payload);
    if (response.type !== 'SUCCESS')
      throw new Error("Error al crear el usuario: ");
    console.log("desde el controller", response);
  return response;
  },

  // actualizar 
  async updateUser(id, payload) {
    return await handleRequest('put', `/users/${id}/`, payload);
  },

  // elimineishon
  async deleteUser(id) {
    return await handleRequest('delete', `/users/${id}/`);
  }
};
