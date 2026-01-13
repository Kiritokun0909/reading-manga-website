import apiClient from './ApiClient';
import HandleCode from '../utilities/HandleCode';

const GENRE_URL = '/genre';
const AUTHOR_URL = '/author';
const MANGA_URL = '/manga';
const CHAPTER_URL = '/chapter';
const ADMIN_URL = '/admin';

//#region Genre
export const addGenre = async (genreName) => {
  try {
    const response = await apiClient.post(`${GENRE_URL}/`, {
      genreName,
    });
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    if (error.response && error.response.status === 409) {
      throw new Error('Thể loại đã tồn tại. Vui lòng thử tên khác.');
    }

    throw new Error('Yêu cầu thất bại. Vui lòng thử lại.');
  }
};

export const updateGenre = async (genreId, genreName) => {
  try {
    const response = await apiClient.put(`${GENRE_URL}/${genreId}`, {
      genreName,
    });
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    if (error.response && error.response.status === 404) {
      throw new Error('Không tìm thấy thể loại. Vui lòng chọn và thử lại.');
    }

    if (error.response && error.response.status === 409) {
      throw new Error('Thể loại đã tồn tại. Vui lòng thử tên khác.');
    }

    throw new Error('Yêu cầu thất bại. Vui lòng thử lại.');
  }
};

export const deleteGenre = async (genreIds) => {
  try {
    const responses = await Promise.all(
      genreIds.map((genreId) => apiClient.delete(`${GENRE_URL}/${genreId}`))
    );

    return responses.map((response) => response.data);
  } catch (error) {
    if (!error?.response) {
      throw new Error('Hệ thống không phân hồi.');
    }

    if (error.response && error.response.status === 404) {
      throw new Error('Không tìm thấy thể loại. Vui lòng chọn và thử lại.');
    }

    throw new Error('Yêu cầu thất baị. Vui lòng thử lại.');
  }
};
//#endregion

//#region Author
export const getListAuthor = async (
  pageNumber = 1,
  itemsPerPage = 10,
  filter = HandleCode.FILTER_BY_AUTHOR_UPDATE_DATE_DESC,
  keyword = ''
) => {
  try {
    const response = await apiClient.get(
      `${AUTHOR_URL}/list?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&filter=${filter}&keyword=${keyword}`
    );
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error('Hệ thống không phân hồi.');
    }

    throw new Error('Yêu cầu thất bị. Vui lòng thử lại.');
  }
};

export const addAuthor = async (fileAvatar, authorName, biography) => {
  const formData = new FormData();
  formData.append('avatar', fileAvatar);
  formData.append('authorName', authorName);
  formData.append('biography', biography);
  try {
    const response = await apiClient.post(AUTHOR_URL, formData);
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    throw new Error('Yêu cầu thất bại. Vui lòng thử lại.');
  }
};

export const updateAuthor = async (authorId, fileAvatar, authorName, biography) => {
  const formData = new FormData();
  formData.append('avatar', fileAvatar);
  formData.append('authorName', authorName);
  formData.append('biography', biography);
  try {
    const response = await apiClient.put(`${AUTHOR_URL}/${authorId}`, formData, {}); // use for dev

    // const response = await apiClientInstance.put(`${AUTHOR_URL}/${authorId}`, {
    //   formData,);
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    if (error.response && error.response.status === 404) {
      throw new Error('Không tìm thấy tác giả. Vui lòng thử lại.');
    }

    throw new Error('Yêu cầu thất bại. Vui lòng thử lại.');
  }
};

export const deleteAuthor = async (authorId) => {
  try {
    const response = await apiClient.delete(`${AUTHOR_URL}/${authorId}`, {});
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    if (error.response && error.response.status === 404) {
      throw new Error('Không tìm thấy tác giả. Vui lòng thử lại.');
    }

    throw new Error('Yêu cầu thất bại. Vui lòng thử lại.');
  }
};
//#endregion

//#region Manga
export const addManga = async (
  fileCoverImage,
  mangaName,
  otherName,
  isManga,
  isFree,
  publishedYear,
  ageLimit,
  description,
  authorId = ''
) => {
  const formData = new FormData();
  formData.append('coverImage', fileCoverImage);
  formData.append('mangaName', mangaName);
  formData.append('otherName', otherName);
  formData.append('isManga', isManga ? 1 : 0);
  formData.append('isFree', isFree ? 1 : 0);
  formData.append('publishedYear', publishedYear);
  formData.append('ageLimit', ageLimit);
  formData.append('description', description);
  formData.append('authorId', authorId);
  try {
    const response = await apiClient.post(MANGA_URL, formData);
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    throw new Error('Yêu cầu thất baị. Vui lòng thử lại.');
  }
};

export const updateManga = async (
  mangaId,
  fileCoverImage,
  mangaName,
  otherName,
  isManga,
  isFree,
  publishedYear,
  ageLimit,
  description,
  authorId = ''
) => {
  const formData = new FormData();
  formData.append('coverImage', fileCoverImage);
  formData.append('mangaName', mangaName);
  formData.append('otherName', otherName);
  formData.append('isManga', isManga ? 1 : 0);
  formData.append('isFree', isFree ? 1 : 0);
  formData.append('publishedYear', publishedYear);
  formData.append('ageLimit', ageLimit);
  formData.append('description', description);
  formData.append('authorId', authorId);
  try {
    const response = await apiClient.put(`${MANGA_URL}/${mangaId}`, formData);
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    throw new Error('Yêu cầu thất bại. Vui lòng thử lại.');
  }
};

export const updateMangaGenres = async (genreIds, mangaId) => {
  try {
    const response = await apiClient.put(`${MANGA_URL}/update-genres/${mangaId}`, {
      genreIds,
    });
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    throw new Error('Yêu cầu thất bại. Vui lòng thử lại.');
  }
};

export const deleteManga = async (mangaId) => {
  try {
    const response = await apiClient.delete(`${MANGA_URL}/${mangaId}`);
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    throw new Error('Yêu cầu thất bại. Vui lòng thử lại.');
  }
};
//#endregion

//#region Chapter
export const addChapter = async (
  mangaId,
  volumeNumber,
  chapterNumber,
  chapterName,
  isManga,
  chapterImages,
  novelContext
) => {
  try {
    const formData = new FormData();
    formData.append('volumeNumber', volumeNumber);
    formData.append('chapterNumber', chapterNumber);
    formData.append('chapterName', chapterName);
    if (isManga) {
      chapterImages.forEach((image) => {
        if (!image) {
          return;
        }
        formData.append('chapterImages', image.file);
      });
    } else {
      formData.append('novelContext', novelContext);
    }
    const response = await apiClient.post(`${CHAPTER_URL}/${mangaId}`, formData);
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    throw new Error('Yêu cầu thất bại. Vui lòng thử lại.');
  }
};

export const updateChapter = async (
  chapterId,
  volumeNumber,
  chapterNumber,
  chapterName,
  isManga,
  chapterImages,
  novelContext
) => {
  try {
    const formData = new FormData();
    formData.append('volumeNumber', volumeNumber);
    formData.append('chapterNumber', chapterNumber);
    formData.append('chapterName', chapterName);
    if (isManga) {
      chapterImages.forEach((image) => {
        if (!image) {
          return;
        }
        formData.append('chapterImages', image.file);
      });
    } else {
      formData.append('novelContext', novelContext);
    }
    const response = await apiClient.put(`${CHAPTER_URL}/${chapterId}`, formData);
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    throw new Error('Yêu cầu thất bại. Vui lòng thử lại.');
  }
};

export const deleteChapter = async (chapterId) => {
  try {
    const response = await apiClient.delete(`${CHAPTER_URL}/${chapterId}`);
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    if (error.response && error.response.status === 404) {
      throw new Error('Không tìm thấy chương. Vui lòng thử lại.');
    }

    throw new Error('Yêu cầu thất bại. Vui lòng thử lại.');
  }
};
//#endregion

//#region User
export const getListUser = async (
  pageNumber = 1,
  itemsPerPage = 5,
  status = HandleCode.ACTIVE_STATUS,
  role = HandleCode.ROLE_USER,
  keyword = ''
) => {
  try {
    const response = await apiClient.get(
      `${ADMIN_URL}/users?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&status=${status}&role=${role}&keyword=${keyword}`
    );
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    throw new Error('Yêu cầu thất bại. Vui lòng thử lại.');
  }
};

export const setUserStatus = async (userId, status = HandleCode.BAN_STATUS) => {
  try {
    const response = await apiClient.put(`${ADMIN_URL}/ban/${userId}`, {
      status: status,
    });
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    if (error.response && error.response.status === 400) {
      throw new Error('Không thể tự khoá tài khoản của bản thân.');
    }

    if (error.response && error.response.status === 404) {
      throw new Error('Mã người dung không tìm thấy. Vui lòng thử lại.');
    }

    throw new Error('Yêu cầu thất bại. Vui lòng thử lại.');
  }
};

export const registerAdmin = async (email, password) => {
  try {
    const response = await apiClient.post(`${ADMIN_URL}/register`, {
      email: email,
      password: password,
    });
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    if (error && error.response.status === 409) {
      throw new Error('Email đã được sử dụng. Vui lòng thử email khác.');
    }

    throw new Error('Yêu cầu thất bại. Vui lòng thử lại.');
  }
};

//#region Document
export const updateDocument = async (docType, content) => {
  try {
    const response = await apiClient.put(`${ADMIN_URL}/document/${docType}`, {
      content: content,
    });
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    throw new Error('Yêu cầu thất bại. Vui lòng thử lại.');
  }
};

//#endregion

//#region Review
export const setReviewStatus = async (reviewId, status = HandleCode.REVIEW_IS_HIDE) => {
  try {
    const response = await apiClient.put(`${ADMIN_URL}/review/${reviewId}`, {
      status: status,
    });
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error('Hệ thống khônh phản hồi.');
    }

    throw new Error('Yêu cầu thất bại. Vui lòng thử lại.');
  }
};
//#endregion

//#region Plan
export const addPlan = async (
  planName,
  price,
  duration,
  description,
  startAt,
  endAt,
  canReadAll,
  mangaIds
) => {
  try {
    const response = await apiClient.post(`/plan`, {
      planName: planName,
      price: price,
      duration: duration,
      description: description,
      startAt: startAt,
      endAt: endAt === '' ? null : endAt,
      canReadAll: canReadAll ? HandleCode.CAN_READ_ALL : HandleCode.CANNOT_READ_ALL,
      mangaIds: mangaIds,
    });
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error('Hệ thống khônh phản hồi.');
    }

    throw new Error('Yêu cầu thất bại. Vui lòng thử lại.');
  }
};

export const updatePlan = async (
  planId,
  planName,
  price,
  duration,
  description,
  startAt,
  endAt,
  canReadAll,
  mangaIds
) => {
  try {
    const response = await apiClient.put(`/plan/${planId}`, {
      planName: planName,
      price: price,
      duration: duration,
      description: description,
      startAt: startAt,
      endAt: endAt === '' ? null : endAt,
      canReadAll: canReadAll ? HandleCode.CAN_READ_ALL : HandleCode.CANNOT_READ_ALL,
      mangaIds: mangaIds,
    });
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    throw new Error('Yêu cầu thất bại. Vui lòng thử lại.');
  }
};

export const deletePlan = async (planId) => {
  try {
    const response = await apiClient.delete(`/plan/${planId}`);
    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    if (error.response && error.response.status === 405) {
      throw new Error('Không thể xoá gói vì đã có người dùng mua nó.');
    }

    throw new Error('Yêu cầu thất bại. Vui lòng thử lại.');
  }
};
//#endregion
