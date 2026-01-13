import apiClient from './ApiClient';

export const getTotalActiveUser = async () => {
  try {
    const response = await apiClient.get('/statistic/active-user');
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    throw new Error('Yêu cầu thất bại. Vui lòng thử lại.');
  }
};

export const getRevenueFromTo = async (startDate, endDate) => {
  try {
    const response = await apiClient.get(
      `/statistic/revenue?startDate=${startDate}&endDate=${endDate} + 23:59:59`
    );
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    throw new Error('Yêu cầu thất bại. Vui lòng thử lại.');
  }
};

export const getTotalManga = async () => {
  try {
    const response = await apiClient.get('/statistic/total-manga');
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    throw new Error('Yêu cầu thất bại. Vui lòng thử lại.');
  }
};

export const getTotalActivePlan = async () => {
  try {
    const response = await apiClient.get('/statistic/active-plan');
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    throw new Error('Yêu cầu thất bị. Vui lòng thử lại.');
  }
};

export const getTopSalePlans = async (month, year) => {
  try {
    const response = await apiClient.get(
      `/statistic/top-plan?month=${month}&year=${year}`
    );
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    throw new Error('Yêu cầu thất bị. Vui lòng thử lại.');
  }
};

export const getRevenueDetail = async (pageNumber, itemsPerPage, keyword) => {
  try {
    const response = await apiClient.get(
      `/statistic/revenue-detail?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&keyword=${keyword}`
    );
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    throw new Error('Yêu cầu thất bại. Vui lòng thử lại.');
  }
};

export const getRevenueFromToByPlan = async (startDate, endDate, planId) => {
  try {
    const response = await apiClient.get(
      `/statistic/revenue-by-plan?planId=${planId}&startDate=${startDate}&endDate=${endDate} + 23:59:59`
    );
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error('Hệ thống không phân hồi.');
    }

    throw new Error('Yêu cầu thất bại. Vui lòng thử lại.');
  }
};
