import {handleRequest} from "../../../config/http-client.gateway.js";

export const signIn = async (email, password) => {
    const response = await handleRequest('post', '/auth/login/', { email, password });

    if (response.type !== 'SUCCESS') {
        throw new Error(response.text);
    }

    const {token, role, user} = response.result;
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('user', user);
    return true;
}