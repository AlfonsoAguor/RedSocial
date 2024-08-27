import instance from './axios.js';

export const registerRequest = user => instance.post(`/user/register`, user);
export const loginRequest = user => instance.post(`/user/login`, user);
export const verifyTokenRequest = () => instance.get(`/user/verify`);