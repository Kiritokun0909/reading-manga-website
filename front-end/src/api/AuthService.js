import axios from "axios";
import axiosInstance from "./axiosInstance";
const AUTH_URL = "/auth";

export const loginApi = async (email, password) => {
  try {
    const response = await axios.post(`${AUTH_URL}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    if (error.response && error.response.status === 401) {
      throw new Error("Tài khoản hoặc mật khẩu không đúng.");
    }

    throw new Error("Đăng nhập thất bại. Vui lòng thử lại.");
  }
};

export const register = async (email, password) => {
  try {
    const response = await axiosInstance.post(`${AUTH_URL}/register`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    if (error.response && error.response.status === 409) {
      throw new Error(
        "Email đã được sử dụng để đăng ký. Vui lòng dùng email khác."
      );
    }

    throw new Error("Đăng ký tài khoản thất bại. Vui lòng thử lại.");
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${AUTH_URL}/forgot-password`, {
      email: email,
    }); // use for dev
    // const response = await axiosInstance.put(
    //   `${ACCOUNT_URL}/${userId}/email`,
    //   { email },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //   }
    // );
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phân hồi.");
    }

    if (error.response && error.response.status === 404) {
      throw new Error("Không tìm thấy email. Vui lòng thử lại.");
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};

export const resetPassword = async (email, otpCode) => {
  try {
    const response = await axios.post(`${AUTH_URL}/reset-password`, {
      email: email,
      otpCode: otpCode,
    }); // use for dev
    // const response = await axiosInstance.put(
    //   `${ACCOUNT_URL}/${userId}/email`,
    //   { email },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //   }
    // );
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phân hồi.");
    }

    if (error.response && error.response.status === 400) {
      throw new Error("Mã OTP đã hết hạn.");
    }

    if (error.response && error.response.status === 404) {
      throw new Error("Email không tìm thấy. Vui lòng thử lại.");
    }

    throw new Error("Yêu cầu thất bị. Vui lòng thử lại.");
  }
};
