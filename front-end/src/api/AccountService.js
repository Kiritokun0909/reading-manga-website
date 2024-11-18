import axios from "axios";
// import axiosInstance from "./axiosInstance";
const ACCOUNT_URL = "/account";

//#region get-info
export const getUserInfo = async (userId = 0) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(`${ACCOUNT_URL}/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }); // use for dev

    // const response = await axiosInstance.get(`${AUTH_URL}/${userId}`);
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
  const accessToken = localStorage.getItem("accessToken");
  const formData = new FormData();
  formData.append("username", username);
  formData.append("avatar", fileAvatar);

  try {
    const response = await axios.put(
      `${ACCOUNT_URL}/`,
      formData, // send formData directly here
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ); // use for dev

    // const response = await axiosInstance.put(
    //   `${ACCOUNT_URL}/`,
    //     formData);
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
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.put(
      `${ACCOUNT_URL}/change-email`,
      {
        email: email,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ); // use for dev
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

    if (error.response && error.response.status === 409) {
      throw new Error("Email đã được sử dụng. Vui lòng dùng email khác.");
    }

    throw new Error("Yêu cầu thất bị. Vui lòng thử lại.");
  }
};
//#endregion

//#region update-pwd
export const updateUserPassword = async (oldPassword, newPassword) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.put(
      `${ACCOUNT_URL}/change-password`,
      {
        oldPassword: oldPassword,
        newPassword: newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ); // use for dev
    // const response = await axiosInstance.put(
    //   `${ACCOUNT_URL}/${userId}/password`,
    //   { password },
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
      throw new Error("Mật khẩu cũ không đúng. Vui lòng thử lại.");
    }

    throw new Error("Yêu cầu thất bị. Vui lòng thử lại.");
  }
};
//#endregion

//#region check-like
export const checkIsLike = async (mangaId) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(`${ACCOUNT_URL}/is-like/${mangaId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }); // use for dev
    // const response = await axiosInstance.get(`${ACCOUNT_URL}/like/${mangaId}/${userId}`);
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
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(`${ACCOUNT_URL}/is-follow/${mangaId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }); // use for dev
    // const response = await axiosInstance.get(`${ACCOUNT_URL}/like/${mangaId}/${userId}`);
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
  const accessToken = localStorage.getItem("accessToken");
  try {
    if (isLike) {
      await axios.post(
        `${ACCOUNT_URL}/like/${mangaId}`,
        { isLike },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } else {
      await axios.delete(`${ACCOUNT_URL}/like/${mangaId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    // await axiosInstance.get(`${ACCOUNT_URL}/like/${mangaId}/${userId}`);
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
  const accessToken = localStorage.getItem("accessToken");
  try {
    if (isFollow) {
      await axios.post(
        `${ACCOUNT_URL}/follow/${mangaId}`,
        { isFollow },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } else {
      await axios.delete(`${ACCOUNT_URL}/follow/${mangaId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    // await axiosInstance.get(`${ACCOUNT_URL}/like/${mangaId}/${userId}`);
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
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(
      `${ACCOUNT_URL}/like-list?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ); // use for dev
    // const response = await axiosInstance.get(`${ACCOUNT_URL}/like/${mangaId}/${userId}`);
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
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(
      `${ACCOUNT_URL}/follow-list?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ); // use for dev
    // const response = await axiosInstance.get(`${ACCOUNT_URL}/like/${mangaId}/${userId}`);
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
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.post(
      `${ACCOUNT_URL}/add-review/${mangaId}`,
      {
        context,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ); // use for dev
    // const response = await axiosInstance.get(`${ACCOUNT_URL}/like/${mangaId}/${userId}`);
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
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(
      `${ACCOUNT_URL}/count-unread-notification`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ); // use for dev
    // const response = await axiosInstance.get(`${ACCOUNT_URL}/like/${mangaId}/${userId}`);
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
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(
      `${ACCOUNT_URL}/notification?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ); // use for dev
    // const response = await axiosInstance.get(`${ACCOUNT_URL}/like/${mangaId}/${userId}`);
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }
    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};
//#endregion
