// src/api/apiClient.js
import axios from "axios";
import { getItem, saveItem } from "@/services/storageService";

const apiClient = axios.create({
  baseURL: "http://192.168.1.124:5000",
});

const REFRESH_TOKEN_URL = "/auth/refresh-token";

apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = await getItem("accessToken");
    if (accessToken) {
      // console.log("Set authorization header");
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is due to token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshToken = await getItem("refreshToken");
          if (refreshToken) {
            const refreshResponse = await axios.post(
              `${apiClient.defaults.baseURL}${REFRESH_TOKEN_URL}`,
              { refreshToken: refreshToken }
            );

            if (refreshResponse.data?.accessToken) {
              const newAccessToken = refreshResponse.data.accessToken;
              await saveItem("accessToken", newAccessToken);
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              processQueue(null, newAccessToken);
              isRefreshing = false;
              return apiClient(originalRequest);
            }
          }
        } catch (refreshError) {
          await logout();
          processQueue(refreshError, null);
          isRefreshing = false;
          console.error("Token refresh failed. Logging out...");
          return Promise.reject(refreshError);
        }
      }

      // Wait for refresh process to complete
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        })
        .catch((queueError) => Promise.reject(queueError));
    }

    return Promise.reject(error);
  }
);

export default apiClient;
