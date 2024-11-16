import axios from "axios";
import HandleCode from "../utilities/HandleCode";
// import axiosInstance from "./axiosInstance";
const GENRE_URL = "/genre";
const AUTHOR_URL = "/author";
const MANGA_URL = "/manga";
const CHAPTER_URL = "/chapter";
const ADMIN_URL = "/admin";

//#region Genre
export const addGenre = async (genreName) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.post(
      `${GENRE_URL}/`,
      {
        genreName,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ); // use for dev

    // const response = await axiosInstance.post(`${GENRE_URL}/`, {
    //   genreName,
    // });
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    if (error.response && error.response.status === 409) {
      throw new Error("Thể loại đã tồn tại. Vui lòng thử tên khác.");
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};

export const updateGenre = async (genreId, genreName) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.put(
      `${GENRE_URL}/${genreId}`,
      {
        genreName,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ); // use for dev

    // const response = await axiosInstance.put(`${GENRE_URL}/${genreId}`, {
    //   genreName,
    // });
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    if (error.response && error.response.status === 404) {
      throw new Error("Không tìm thấy thể loại. Vui lòng chọn và thử lại.");
    }

    if (error.response && error.response.status === 409) {
      throw new Error("Thể loại đã tồn tại. Vui lòng thử tên khác.");
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};

export const deleteGenre = async (genreIds) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const responses = await Promise.all(
      genreIds.map(
        (genreId) =>
          axios.delete(`${GENRE_URL}/${genreId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
        // axiosInstance.delete(`${GENRE_URL}/${genreId}`);
      )
    );

    return responses.map((response) => response.data);
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phân hồi.");
    }

    if (error.response && error.response.status === 404) {
      throw new Error("Không tìm thấy thể loại. Vui lòng chọn và thử lại.");
    }

    throw new Error("Yêu cầu thất baị. Vui lòng thử lại.");
  }
};
//#endregion

//#region Author
export const getListAuthor = async (
  pageNumber = 1,
  itemsPerPage = 10,
  filter = HandleCode.FILTER_BY_AUTHOR_UPDATE_DATE_DESC,
  keyword = ""
) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(
      `${AUTHOR_URL}/list?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&filter=${filter}&keyword=${keyword}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ); // use for dev

    // const response = await axiosInstance.get(AUTHOR_URL);
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phân hồi.");
    }

    throw new Error("Yêu cầu thất bị. Vui lòng thử lại.");
  }
};

export const addAuthor = async (fileAvatar, authorName, biography) => {
  const accessToken = localStorage.getItem("accessToken");
  const formData = new FormData();
  formData.append("avatar", fileAvatar);
  formData.append("authorName", authorName);
  formData.append("biography", biography);
  try {
    const response = await axios.post(AUTHOR_URL, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }); // use for dev

    // const response = await axiosInstance.post(AUTHOR_URL, {
    //   formData,);
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};

export const updateAuthor = async (
  authorId,
  fileAvatar,
  authorName,
  biography
) => {
  const accessToken = localStorage.getItem("accessToken");
  const formData = new FormData();
  formData.append("avatar", fileAvatar);
  formData.append("authorName", authorName);
  formData.append("biography", biography);
  try {
    const response = await axios.put(`${AUTHOR_URL}/${authorId}`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }); // use for dev

    // const response = await axiosInstance.put(`${AUTHOR_URL}/${authorId}`, {
    //   formData,);
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    if (error.response && error.response.status === 404) {
      throw new Error("Không tìm thấy tác giả. Vui lòng thử lại.");
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};

export const deleteAuthor = async (authorId) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.delete(`${AUTHOR_URL}/${authorId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }); // use for dev

    // const response = await axiosInstance.delete(`${AUTHOR_URL}/${authorId}`);
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    if (error.response && error.response.status === 404) {
      throw new Error("Không tìm thấy tác giả. Vui lòng thử lại.");
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};
//#endregion

//#region Manga
export const addManga = async (
  fileCoverImage,
  mangaName,
  otherName,
  isManga,
  publishedYear,
  ageLimit,
  description,
  authorId = ""
) => {
  const accessToken = localStorage.getItem("accessToken");
  const formData = new FormData();
  formData.append("coverImage", fileCoverImage);
  formData.append("mangaName", mangaName);
  formData.append("otherName", otherName);
  formData.append("isManga", isManga ? 1 : 0);
  formData.append("publishedYear", publishedYear);
  formData.append("ageLimit", ageLimit);
  formData.append("description", description);
  formData.append("authorId", authorId);
  try {
    const response = await axios.post(MANGA_URL, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }); // use for dev

    // const response = await axiosInstance.post(MANGA_URL, {
    //   formData,);
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    throw new Error("Yêu cầu thất baị. Vui lòng thử lại.");
  }
};

export const updateManga = async (
  mangaId,
  fileCoverImage,
  mangaName,
  otherName,
  isManga,
  publishedYear,
  ageLimit,
  description,
  authorId = ""
) => {
  const accessToken = localStorage.getItem("accessToken");
  const formData = new FormData();
  formData.append("coverImage", fileCoverImage);
  formData.append("mangaName", mangaName);
  formData.append("otherName", otherName);
  formData.append("isManga", isManga ? 1 : 0);
  formData.append("publishedYear", publishedYear);
  formData.append("ageLimit", ageLimit);
  formData.append("description", description);
  formData.append("authorId", authorId);
  try {
    const response = await axios.put(`${MANGA_URL}/${mangaId}`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }); // use for dev

    // const response = await axiosInstance.put(`${MANGA_URL}/${mangaId}`, {
    //   formData,);
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};

export const updateMangaGenres = async (genreIds, mangaId) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.put(
      `${MANGA_URL}/update-genres/${mangaId}`,
      { genreIds },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ); // use for dev

    // const response = await axiosInstance.put(`${MANGA_URL}/update-genres/${mangaId}`, {
    //   genreIds,);
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};

export const deleteManga = async (mangaId) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.delete(`${MANGA_URL}/${mangaId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }); // use for dev

    // const response = await axiosInstance.delete(`${MANGA_URL}/${mangaId}`);
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};
//#endregion

//#region Chapter
export const addChapter = async (
  mangaId,
  volumeNumber,
  chapterNumber,
  chapterName,
  isFree,
  isManga,
  chapterImages,
  novelContext
) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const formData = new FormData();
    formData.append("volumeNumber", volumeNumber);
    formData.append("chapterNumber", chapterNumber);
    formData.append("chapterName", chapterName);
    formData.append("isFree", isFree ? 1 : 0);
    if (isManga) {
      chapterImages.forEach((image) => {
        if (!image) {
          return;
        }
        formData.append("chapterImages", image.file);
      });
    } else {
      formData.append("novelContext", novelContext);
    }
    const response = await axios.post(`${CHAPTER_URL}/${mangaId}`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }); // use for dev

    // const response = await axiosInstance.post(`${CHAPTER_URL}/`, formData,);
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};

export const updateChapter = async (
  chapterId,
  volumeNumber,
  chapterNumber,
  chapterName,
  isFree,
  isManga,
  chapterImages,
  novelContext
) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const formData = new FormData();
    formData.append("volumeNumber", volumeNumber);
    formData.append("chapterNumber", chapterNumber);
    formData.append("chapterName", chapterName);
    console.log(isFree ? 1 : 0);
    formData.append("isFree", isFree ? 1 : 0);
    if (isManga) {
      chapterImages.forEach((image) => {
        if (!image) {
          return;
        }
        formData.append("chapterImages", image.file);
      });
    } else {
      formData.append("novelContext", novelContext);
    }
    const response = await axios.put(`${CHAPTER_URL}/${chapterId}`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }); // use for dev

    // const response = await axiosInstance.post(`${CHAPTER_URL}/`, formData,);
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};

export const deleteChapter = async (chapterId) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.delete(`${CHAPTER_URL}/${chapterId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }); // use for dev

    // const response = await axiosInstance.delete(`${CHAPTER_URL}/${chapterId}`);
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    if (error.response && error.response.status === 404) {
      throw new Error("Không tìm thấy chương. Vui lòng thử lại.");
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};
//#endregion

//#region User
export const getListUser = async (
  pageNumber = 1,
  itemsPerPage = 5,
  status = HandleCode.ACTIVE_STATUS,
  role = HandleCode.ROLE_USER,
  keyword = ""
) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(
      `${ADMIN_URL}/users?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&status=${status}&role=${role}&keyword=${keyword}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ); // use for dev

    // const response = await axiosInstance.get(`${ADMIN_URL}/users?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&status=${status}&role=${role}`); // use for dev
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};

export const setUserStatus = async (userId, status = HandleCode.BAN_STATUS) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.put(
      `${ADMIN_URL}/ban/${userId}`,
      {
        status: status,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ); // use for dev

    // const response = await axiosInstance.put(`${ADMIN_URL}/users/${userId}`, {
    //   isBanned,
    // });
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    if (error.response && error.response.status === 400) {
      throw new Error("Không thể tự khoá tài khoản của bản thân.");
    }

    if (error.response && error.response.status === 404) {
      throw new Error("Mã người dung không tìm thấy. Vui lòng thử lại.");
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};

export const registerAdmin = async (email, password) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.post(
      `${ADMIN_URL}/register`,
      {
        email: email,
        password: password,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    if (error && error.response.status === 409) {
      throw new Error("Email đã được sử dụng. Vui lòng thử email khác.");
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};

//#region Document
export const updateDocument = async (docType, content) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.put(
      `${ADMIN_URL}/document/${docType}`,
      {
        content: content,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ); // use for dev

    // const response = await axiosInstance.put(`${ADMIN_URL}/document/${docType}`, {
    //   content: content,
    // });
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    throw new Error("Yêu cầu thất bại. Vui lòng thử lại.");
  }
};
