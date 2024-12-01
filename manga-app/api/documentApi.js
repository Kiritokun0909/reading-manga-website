// src/api/documentApi.js;
import apiClient from "./apiClient";
import { ENDPOINTS } from "./endpoints";
import HandleCode from "../utils/HandleCode";

export const fetchDocument = async (docType = HandleCode.DOC_TYPE_ABOUT) => {
  const response = await apiClient.get(ENDPOINTS.GET_DOCUMENT + `/${docType}`);
  return response.data;
};
