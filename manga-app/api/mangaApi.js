// src/api/mangaApi.js
import apiClient from "./apiClient";
import { ENDPOINTS } from "./endpoints";
import HandleCode from "../utils/HandleCode";

export const fetchMangas = async (
  pageNumber = 1,
  itemsPerPage = HandleCode.ITEMS_PER_PAGE,
  filter = HandleCode.FILTER_BY_MANGA_UPDATE_DATE_DESC,
  keyword = ""
) => {
  const response = await apiClient.get(
    ENDPOINTS.GET_LIST_MANGAS +
      `?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&filter=${filter}&keyword=${keyword}`
  );
  return response.data;
};

export const fetchMangasByGenre = async (
  genreId,
  pageNumber = 1,
  itemsPerPage = HandleCode.ITEMS_PER_PAGE
) => {
  const response = await apiClient.get(
    ENDPOINTS.GET_LIST_MANGAS_BY_GENRE +
      `/${genreId}?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}`
  );
  return response.data;
};
