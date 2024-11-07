import axios from "axios";
// import axiosInstance from "./axiosInstance";
const ACCOUNT_URL = "/account";

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
