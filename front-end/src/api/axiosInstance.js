// axiosInstance.js
import axios from "axios";
const API_BASE_URL = "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Thiết lập interceptor cho request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Thiết lập interceptor cho response để làm mới token khi gặp lỗi 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post(
          "http://localhost:5000/auth/refresh-token",
          { refreshToken }
        );

        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);

        // Cập nhật accessToken mới vào header và gửi lại request gốc
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        // Nếu refresh token thất bại, điều hướng về trang login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("roleId");
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
