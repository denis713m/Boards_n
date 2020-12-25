import axios from 'axios';

const instance = axios.create({
    baseURL: `http://192.168.99.100:1313/`,
    //baseURL: `http://localhost:5555/`,
});

instance.interceptors.request.use(async (config) => {
    const token = window.localStorage.getItem('accessToken');
    if (token) {
        config.headers = { ...config.headers, Authorization: token };
    }
    return config;
});

instance.interceptors.response.use(
    (response) => {
        if (response.data.accessToken) {
            window.localStorage.setItem('accessToken', response.data.accessToken);
        }
        return response;
    },
    (reject) => {
        console.log(reject.response);
        if (!reject.response) {
            alert('Oops problems with connection');
        } else if (reject.response.data === 'jwt expired') {
            localStorage.removeItem('accessToken');
            alert('Session expired, relogin');
            window.location.replace('/login');
        }
        return Promise.reject(reject);
    }
);
export default instance;
