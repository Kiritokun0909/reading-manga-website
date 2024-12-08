// src/api/paymentApi.js;
import apiClient from "./apiClient";
import { ENDPOINTS } from "./endpoints";

export const fetchPaymentSheet = async (amount, currency = "vnd") => {
  try {
    const response = await apiClient.post(ENDPOINTS.GET_PAYMENT_SHEET, {
      amount,
      currency,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (!error?.response) {
      return { success: false, message: "Hệ thống không phản hồi." };
    }

    return { success: false, message: "Yêu cầu thất bại. Vui lòng thử lại." };
  }
};

export const confirmPayment = async (userPlanId) => {
  try {
    const response = await apiClient.get(
      ENDPOINTS.CONFIRM_PAYMENT + `/${userPlanId}`
    );
    return {
      success: true,
    };
  } catch (error) {
    if (!error?.response) {
      return { success: false, message: "Hệ thống không phản hồi." };
    }

    return { success: false, message: "Yêu cầu thất bại. Vui lòng thử lại." };
  }
};
