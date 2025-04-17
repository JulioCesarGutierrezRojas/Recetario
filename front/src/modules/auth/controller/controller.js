import {handleRequest} from "../../../config/http-client.gateway.js";

export const signIn = async (email, password) => {
    const response = await handleRequest('post', '/auth/login/', { email, password });

    if (response.type !== 'SUCCESS')
        throw new Error(response.text);

    const {token, role, user} = response.result;
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('user', user);
    return true;
}

export const sendEmail = async (email) => {
    const response = await handleRequest('post', '/auth/password-recover/', { email })

    if (response.type !== 'SUCCESS')
        throw new Error(response.text);

    return response.result.message;
}

export const verifyToken = async (token) => {
    const response = await handleRequest('post', '/auth/verify-token/', { token })

    if (response.type !== 'SUCCESS')
        throw new Error(response.text);

    return response.result;
}

export const changePassword = async (user,  new_password, confirm_password) => {
    const response = await handleRequest('post', '/auth/change-password/', { user, new_password, confirm_password })

    if (response.type !== 'SUCCESS')
        throw new Error(response.text);

    return response.result;
}

export const registerUser = async (name, email, sex, password) => {
    const response = await handleRequest('post', '/users/register/', {name, email, sex, password})
    console.log('registerUser:', response)
    if (response.type !== 'SUCCESS')
        throw new Error(response.text);

    return response.text;
}