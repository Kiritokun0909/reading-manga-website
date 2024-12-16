import apiClient from "./ApiClient";

export const hideManga = async (mangaId, isHide = true) => {
  try {
    const response = await apiClient.put(`/manga/hide-manga/${mangaId}`, {
      isHide: isHide,
    });
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};
