import { handleRequest } from "../../../config/http-client.gateway";

export const UserController = {
    async getUsers() {
        return await handleRequest('get', '/users');
    },

    async createUser(payload) {
        return await handleRequest('post', '/users', payload);
    },
    
};
