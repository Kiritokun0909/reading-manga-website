import apiClient from "./ApiClient";
const ACCOUNT_URL = "/account";

//#region get-info
export const getUserInfo = async (userId = 0) => {
  try {
    const response = await apiClient.get(`${ACCOUNT_URL}/${userId}`);
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    if (error.response && error.response.status === 404) {
      throw new Error("Không tìm thấy người dùng");
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};
//#endregion

//#region update-info
export const updateUserInfo = async (username, fileAvatar) => {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("avatar", fileAvatar);

  try {
    const response = await apiClient.put(`${ACCOUNT_URL}/`, formData);
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    throw new Error("Yêu cầu thất bị. Vui lòng thử lại.");
  }
};
//#endregion

//#region update-email
export const updateUserEmail = async (email) => {
  try {
    const response = await apiClient.put(`${ACCOUNT_URL}/change-email`, {
      email: email,
    });
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phân hồi.");
    }

    if (error.response && error.response.status === 409) {
      throw new Error("Email đã được sử dụng. Vui lòng dùng email khác.");
    }

    throw new Error("Yêu cầu thất bị. Vui lòng thử lại.");
  }
};
//#endregion

//#region update-pwd
export const updateUserPassword = async (oldPassword, newPassword) => {
  try {
    const response = await apiClient.put(`${ACCOUNT_URL}/change-password`, {
      oldPassword: oldPassword,
      newPassword: newPassword,
    });
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phân hồi.");
    }

    if (error.response && error.response.status === 400) {
      throw new Error("Mật khẩu cũ không đúng. Vui lòng thử lại.");
    }

    throw new Error("Yêu cầu thất bị. Vui lòng thử lại.");
  }
};
//#endregion

//#region check-like
export const checkIsLike = async (mangaId) => {
  try {
    const response = await apiClient.get(`${ACCOUNT_URL}/is-like/${mangaId}`);
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    if (error.response && error.response.status === 404) {
      throw error.response.status;
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};
//#endregion

//#region check-follow
export const checkIsFollow = async (mangaId) => {
  try {
    const response = await apiClient.get(`${ACCOUNT_URL}/is-follow/${mangaId}`);
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    if (error.response && error.response.status === 404) {
      throw error.response.status;
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};
//#endregion

//#region like-manga
export const likeManga = async (mangaId, isLike = true) => {
  try {
    if (isLike) {
      await apiClient.post(`${ACCOUNT_URL}/like/${mangaId}`, { isLike });
    } else {
      await apiClient.delete(`${ACCOUNT_URL}/like/${mangaId}`);
    }
    return;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    if (error.response && error.response.status === 404) {
      throw error.response.status;
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};
//#endregion

//#region follow-manga
export const followManga = async (mangaId, isFollow = true) => {
  try {
    if (isFollow) {
      await apiClient.post(`${ACCOUNT_URL}/follow/${mangaId}`, { isFollow });
    } else {
      await apiClient.delete(`${ACCOUNT_URL}/follow/${mangaId}`);
    }
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    if (error.response && error.response.status === 404) {
      throw error.response.status;
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};

//#endregion

//#region get-list-líke
export const getListLike = async (pageNumber, itemsPerPage) => {
  try {
    const response = await apiClient.get(
      `${ACCOUNT_URL}/like-list?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}`
    );
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    if (error.response && error.response.status === 404) {
      throw error.response.status;
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};
//#endregion

//#region get-list-follow
export const getListFollow = async (pageNumber, itemsPerPage) => {
  try {
    const response = await apiClient.get(
      `${ACCOUNT_URL}/follow-list?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}`
    );
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    if (error.response && error.response.status === 404) {
      throw error.response.status;
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};
//#endregion

//#region user-review
export const addReview = async (mangaId, context) => {
  try {
    const response = await apiClient.post(
      `${ACCOUNT_URL}/add-review/${mangaId}`,
      {
        context,
      }
    );
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }
    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};
//#endregion

//#region count-unread-notification
export const countUnreadNotification = async () => {
  try {
    const response = await apiClient.get(
      `${ACCOUNT_URL}/count-unread-notification`
    );
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }
    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};
//#endregion

//#region get-list-notification
export const getNotifications = async (pageNumber, itemsPerPage) => {
  try {
    const response = await apiClient.get(
      `${ACCOUNT_URL}/notification?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}`
    );
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }
    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};
//#endregion

//#region read-notification
export const readNotification = async (notificationId) => {
  try {
    const response = await apiClient.put(
      `${ACCOUNT_URL}/read-notification/${notificationId}`,
      {}
    );
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }
    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};
//#endregion

//#region buy-plan
export const buyPlan = async (planId) => {
  try {
    const response = await apiClient.get(`/plan/buy/${planId}`);
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    if (error.response && error.response.status === 405) {
      throw new Error(
        "Bạn đã mua và kích hoạt gói này. Hiện tại không thể mua lại cho đến khi gói hết hạn."
      );
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};
//#endregion

//#region get-purchase-history
export const getPurchaseHistory = async (pageNumber, itemsPerPage) => {
  try {
    const response = await apiClient.get(
      `/plan/history?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}`
    );
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }
    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};
//#endregion
