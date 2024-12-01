// src/api/genreApi.js
import apiClient from "./apiClient";
import { ENDPOINTS } from "./endpoints";

export const fetchGenres = async () => {
  const response = await apiClient.get(ENDPOINTS.GET_LIST_GENRES);
  return response.data;
};
