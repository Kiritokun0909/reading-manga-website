import axios from "axios";

export const getTotalActiveUser = async () => {
  try {
    const response = await axios.get("/statistic/active-user");
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};

export const getRevenueFromTo = async (startDate, endDate) => {
  try {
    const response = await axios.get(
      `/statistic/revenue?startDate=${startDate}&endDate=${endDate} + 23:59:59`
    );
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};

export const getTotalManga = async () => {
  try {
    const response = await axios.get("/statistic/total-manga");
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};

export const getTotalActivePlan = async () => {
  try {
    const response = await axios.get("/statistic/active-plan");
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    throw new Error("Yêu cầu thất bị. Vui lòng thử lại.");
  }
};

export const getTopSalePlans = async (month, year) => {
  try {
    const response = await axios.get(
      `/statistic/top-plan?month=${month}&year=${year}`
    );
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    throw new Error("Yêu cầu thất bị. Vui lòng thử lại.");
  }
};
