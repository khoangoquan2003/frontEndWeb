// api/Http.js
import axios from "axios";

export const http = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
});

// ✅ Thêm interceptor để tự động gắn token vào header
http.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);



// http.interceptors.request.use(
//     function (config) {
//         const token = localStorage.getItem('token')
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`
//         }
//         return config
//     },
//     function (error) {
//         return Promise.reject(error)
//     }
// )
//
// http.interceptors.response.use(
//     function (response) {
//         const { url } = response.config
//         if (url === '/auth/get-token') {
//             const { token, refreshToken } = (response.data as ApiResponse<TokenResponse>).data;
//             setTokenToLS('token', token)
//             setTokenToLS('refreshToken', refreshToken)
//             // setTokenToLS('id')
//             console.log("interceptor run")
//             console.log(token, refreshToken)
//         } else if (url === '/logout') {
//             clearLS();
//         }
//         return response;
//     },
//     function (error) {
//         if (error.response?.status === 401) {
//             clearLS()
//             window.location.href = '/login'
//         }
//         return Promise.reject(error);
//     },
// )
