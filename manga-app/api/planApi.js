// src/api/documentApi.js;
import apiClient from "./apiClient";
import { ENDPOINTS } from "./endpoints";
import HandleCode from "../utils/HandleCode";

export const fetchPlanInfo = async (planId) => {
  try {
    const response = await apiClient.get(
      ENDPOINTS.GET_PLAN_INFO + `/${planId}`
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return { success: false, message: "Yêu cầu thất bại. Vui lòng thử lại." };
  }
};

export const buyPlan = async (planId) => {
  try {
    const response = await apiClient.get(ENDPOINTS.BUY_PLAN + `/${planId}`);
    return response.data;
  } catch (error) {
    if (!error?.response) {
      return { success: false, message: "Hệ thống không phản hồi." };
    }

    if (error.response && error.response.status === 405) {
      return {
        success: false,
        message: "Bạn đã mua và kích hoạt gói này.",
      };
    }

    return { success: false, message: "Yêu cầu thất bại. Vui lòng thử lại." };
  }
};
