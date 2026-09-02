import axios from 'axios';

// const axiosClient = axios.create({
//   baseURL: 'http://localhost:8080/api', //Spring Boot backend
//   withCredentials: true, // REQUIRED — sends the session cookie on every request
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

const axiosClient = axios.create({
  baseURL: '/api', // was 'http://localhost:8080/api'
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;