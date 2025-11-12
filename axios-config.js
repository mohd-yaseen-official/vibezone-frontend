import axios from "axios";

const baseURL = "https://vibezone-api.onrender.com/api/v1/";

export const privateAxios = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

privateAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

privateAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem("refresh_token");
                const res = await axios.post(`${baseURL}/auth/refresh`, {
                    token: refreshToken,
                });
                const newAccessToken = res.data.access_token;
                localStorage.setItem("access_token", newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return privateAxios(originalRequest);
            } catch (err) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/auth";
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export const publicAxios = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: false,
});
