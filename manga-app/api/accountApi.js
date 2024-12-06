// src/api/accountApi.js
import apiClient from "./apiClient";
import { ENDPOINTS } from "./endpoints";

export const fetchProfile = async () => {
  try {
    const response = await apiClient.get(ENDPOINTS.GET_USER_INFO);
    return response.data;
  } catch (error) {
    if (!error?.response) {
      return {
        success: false,
        message: "Hệ thống không phản hồi.",
      };
    }

    if (error.response && error.response.status === 404) {
      return {
        success: false,
        message: "Không tìm thấy người dùng.",
      };
    }

    return {
      success: false,
      message: "Yêu cầu thất bại. Vui lòng thử lại.",
    };
  }
};

export const updateProfile = async (username, fileAvatar) => {
  try {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("avatar", fileAvatar);
    console.log(fileAvatar);
    const response = await apiClient.put(ENDPOINTS.UPDATE_USER_INFO, formData);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (!error?.response) {
      return {
        success: false,
        message: "Hệ thống không phản hồi.",
      };
    }

    return {
      success: false,
      message: "Yêu cầu thất bại. Vui lòng thử lại.",
    };
  }
};

export const updateEmail = async (email) => {
  try {
    const response = await apiClient.put(ENDPOINTS.UPDATE_USER_EMAIL, {
      email,
    });
    return {
      success: true,
      data: response.data,
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
        message: "Email đã được sử dụng.",
      };
    }

    return {
      success: false,
      message: "Yêu cầu thất bại. Vui lòng thử lại.",
    };
  }
};

export const updatePassword = async (oldPassword, newPassword) => {
  try {
    const response = await apiClient.put(ENDPOINTS.UPDATE_USER_PASSWORD, {
      oldPassword,
      newPassword,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.log(error);
    if (!error?.response) {
      return {
        success: false,
        message: "Hệ thống không phản hồi.",
      };
    }

    if (error.response && error.response.status === 400) {
      return {
        success: false,
        message: "Mật khẩu cũ không đúng.",
      };
    }

    return {
      success: false,
      message: "Yêu cầu thất bị. Vui lòng thử lại.",
    };
  }
};

export const fetchLikeList = async (pageNumber, itemsPerPage) => {
  try {
    const response = await apiClient.get(
      ENDPOINTS.GET_LIKE_LIST +
        `?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}`
    );
    return response.data;
  } catch (error) {
    if (!error?.response) {
      return {
        success: false,
        message: "Hệ thống không phản hồi.",
      };
    }

    return {
      success: false,
      message: "Yêu cầu thất bại. Vui lòng thử lại.",
    };
  }
};

export const fetchFollowList = async (pageNumber, itemsPerPage) => {
  try {
    const response = await apiClient.get(
      ENDPOINTS.GET_FOLLOW_LIST +
        `?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}`
    );
    return response.data;
  } catch (error) {
    if (!error?.response) {
      return {
        success: false,
        message: "Hệ thống không phản hồi.",
      };
    }

    return {
      success: false,
      message: "Yêu cầu thất bại. Vui lòng thử lại.",
    };
  }
};

export const fetchNotifications = async (pageNumber, itemsPerPage) => {
  try {
    const response = await apiClient.get(
      ENDPOINTS.GET_NOTIFICATION +
        `?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}`
    );
    return response.data;
  } catch (error) {
    if (!error?.response) {
      return {
        success: false,
        message: "Hệ thống không phản hồi.",
      };
    }

    return {
      success: false,
      message: "Yêu cầu thất bại. Vui lòng thử lại.",
    };
  }
};

export const readNotification = async (notificationId) => {
  try {
    const response = await apiClient.put(
      ENDPOINTS.READ_NOTIFICATION + `/${notificationId}`
    );
    return response.data;
  } catch (error) {
    if (!error?.response) {
      return {
        success: false,
        message: "Hệ thống không phản hồi.",
      };
    }

    return {
      success: false,
      message: "Yêu cầu thất bại. Vui lòng thử lại.",
    };
  }
};

export const checkUserLikeManga = async (mangaId) => {
  try {
    await apiClient.get(ENDPOINTS.CHECK_USER_LIKE + `/${mangaId}`);
    return true;
  } catch (error) {
    return false;
  }
};

export const checkUserFollowManga = async (mangaId) => {
  try {
    await apiClient.get(ENDPOINTS.CHECK_USER_FOLLOW + `/${mangaId}`);
    return true;
  } catch (error) {
    return false;
  }
};

export const likeManga = async (mangaId, isLike = true) => {
  try {
    if (isLike) {
      await apiClient.post(ENDPOINTS.LIKE_MANGA + `/${mangaId}`, { isLike });
    } else {
      await apiClient.delete(ENDPOINTS.LIKE_MANGA + `/${mangaId}`);
    }
    return true;
  } catch (error) {
    return false;
  }
};

export const followManga = async (mangaId, isFollow = true) => {
  try {
    if (isFollow) {
      await apiClient.post(ENDPOINTS.FOLLOW_MANGA + `/${mangaId}`, {
        isFollow,
      });
    } else {
      await apiClient.delete(ENDPOINTS.FOLLOW_MANGA + `/${mangaId}`);
    }
    return true;
  } catch (error) {
    return false;
  }
};

export const postReview = async (mangaId, review) => {
  try {
    await apiClient.post(ENDPOINTS.POST_REVIEW + `/${mangaId}`, {
      context: review,
    });
    return true;
  } catch (error) {
    return false;
  }
};
