// src/api/endpoints.js
export const ENDPOINTS = {
  // Document
  GET_DOCUMENT: "/site/document",

  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",

  // Genre
  GET_LIST_GENRES: "/genre/list",

  // Manga
  GET_LIST_MANGAS: "/manga/list",
  GET_LIST_MANGAS_BY_GENRE: "/manga/genre",

  // Account
  GET_USER_INFO: "/account/0",
  UPDATE_USER_INFO: "/account/",
  UPDATE_USER_EMAIL: "/account/change-email",
  UPDATE_USER_PASSWORD: "/account/change-password",
};
