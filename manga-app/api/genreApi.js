// src/api/postApi.js
import axios from "axios";

import apiClient from "./apiClient";
import { ENDPOINTS } from "./endpoints";

export const fetchGenres = async () => {
  const response = await apiClient.get(ENDPOINTS.GET_LIST_GENRES);
  return response.data;
};
