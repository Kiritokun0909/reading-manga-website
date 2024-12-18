import axios from "axios";
// import axiosInstance from "./axiosInstance";
import HandleCode from "../utilities/HandleCode";

export const getDocument = async (docType = HandleCode.DOC_TYPE_ABOUT) => {
  try {
    const response = await axios.get(`/site/document/${docType}`); //use for dev
    // const response = await axiosInstance.get(`/document/${docType}`);
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};

//#region get-list-genre
export const getListGenres = async () => {
  try {
    const response = await axios.get(`/genre/list`); //use for dev
    // const response = await axiosInstance.get(`/genre/list`);
    return response.data;
  } catch (error) {
    console.error("Error fetching list genre:", error);
  }
};
//#endregion

//#region get-list-manga
export const getListManga = async (
  pageNumber,
  itemsPerPage,
  filter = HandleCode.FILTER_BY_MANGA_UPDATE_DATE_DESC,
  keyword = ""
) => {
  try {
    const response = await axios.get(
      `/manga/list?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&filter=${filter}&keyword=${keyword}`
    ); //use for dev
    // const response = await axiosInstance.get(
    //   `/manga/list?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&filter=${filter}`
    // );
    return response.data;
  } catch (error) {
    console.error("Error fetching list manga:", error);
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};
//#endregion

export const getListMangaByGenre = async (
  genreId,
  pageNumber,
  itemsPerPage
) => {
  try {
    const response = await axios.get(
      `/manga/genre/${genreId}?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}`
    ); //use for dev
    // const response = await axios.get(
    //   `${API_BASE_URL}/manga/genre/${genreId}?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}`
    // );
    return response.data;
  } catch (error) {
    console.error("Error fetching list genre:", error);
  }
};

export const getListMangaByAuthor = async (
  authorId,
  pageNumber,
  itemsPerPage
) => {
  try {
    const response = await axios.get(
      `/manga/author/${authorId}?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching list author:", error);
  }
};

export const getListMangaByKeyword = async (
  keyword,
  filter,
  pageNumber,
  itemsPerPage
) => {
  try {
    const response = await axios.get(
      `/manga/list?keyword=${keyword}&pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&filter=${filter}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching list keyword:", error);
  }
};

//#region detail-manga
export const getDetailManga = async (mangaId) => {
  try {
    const response = await axios.get(`/manga/${mangaId}`); //use for dev
    // const response = await axiosInstance.get(`/manga/detail/${mangaId}`);
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    if (error.response && error.response.status === 404) {
      throw new Error("Không tìm thấy truyện.");
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};
//#endregion

//#region list-chapter
export const getListChapter = async (mangaId) => {
  try {
    const response = await axios.get(`/chapter/list/${mangaId}`); //use for dev
    // const response = await axiosInstance.get(`/chapter/list/${mangaId}`);
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

//#region chapter-detail
class MangaError extends Error {
  constructor(message, mangaId) {
    super(message); // Call the parent constructor with the message
    this.name = "MangaError"; // Optional: to distinguish from other error types
    this.mangaId = mangaId; // Add mangaId as a custom property
  }
}

export const getChapterDetail = async (chapterId) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(`/chapter/${chapterId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }); //use for dev
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    const mangaId = error.response?.data?.mangaId || null;

    if (error.response && error.response.status === 403) {
      throw new MangaError("Yêu cầu mua gói để đọc.", mangaId);
    }

    if (error.response && error.response.status === 404) {
      throw new MangaError("Không tìm thấy chương.");
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};
//#endregion

//#region list-review
export const getListReview = async (
  mangaId,
  itemsPerPage = 5,
  pageNumber = 1
) => {
  try {
    const response = await axios.get(
      `/manga/reviews/${mangaId}?itemsPerPage=${itemsPerPage}&pageNumber=${pageNumber}`
    ); //use for dev
    // const response = await axiosInstance.get(`/comment/list/${chapterId}`);
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};
//#endregion

//#region PLAN
export const getListPlan = async (
  itemsPerPage,
  pageNumber,
  filter,
  keyword
) => {
  try {
    const response = await axios.get(
      `/plan/list?itemsPerPage=${itemsPerPage}&pageNumber=${pageNumber}&filter=${filter}&keyword=${keyword}`
    ); // use for dev

    // const response = await axiosInstance.get(`${ADMIN_URL}/subscription/list?itemsPerPage=${itemsPerPage}&pageNumber=${pageNumber}&filter=${filter}&keyword=${keyword}`); // use for dev
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};

export const getListPlanByMangaId = async (mangaId) => {
  try {
    const response = await axios.get(`/plan/list-by-manga/${mangaId}`);
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};

export const getPlanDetail = async (planId) => {
  try {
    const response = await axios.get(`/plan/${planId}`); //use for dev
    // const response = await axiosInstance.get(`/subscription/detail/${subscriptionId}`);
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};
//#endregion
