import http from './interceptors';

export const registerRequest = (userInfo) => http.post('registration', userInfo);
export const loginRequest = (userInfo) => http.post('login', userInfo);
export const getUserRequest = () => http.post('getUser');