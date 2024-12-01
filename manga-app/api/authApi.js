// src/api/authApi.js
import axios from "axios";

import apiClient from "./apiClient";
import { ENDPOINTS } from "./endpoints";

export const registerApi = async (email, password) => {
  try {
    const response = await apiClient.post(ENDPOINTS.REGISTER, {
      email,
      password,
    });
    return {
      success: true,
      response: response.data,
    };
  } catch (error) {
    if (!error?.response) {
      return {
        success: false,
        message: "Hệ thống không phản hồi.",
      };
    }

    if (error.response && error.response.status === 409) {
      return {
        success: false,
        message: "Email đã được sử dụng để đăng ký.",
      };
    }

    return {
      success: false,
      message: "Đăng ký tài khoản thất bại.",
    };
  }
};

export const loginApi = async (email, password) => {
  try {
    const response = await apiClient.post(ENDPOINTS.LOGIN, {
      email,
      password,
    });
    return {
      success: true,
      tokens: response.data,
    };
  } catch (error) {
    if (!error?.response) {
      return {
        success: false,
        message: "Hệ thống không phản hồi.",
      };
    }

    if (error.response && error.response.status === 401) {
      return {
        success: false,
        message: "Tài khoản hoặc mật khẩu không đúng.",
      };
    }

    return {
      success: false,
      message: "Đăng nhập thất bại. Vui lòng thử lại sau.",
    };
  }
};
