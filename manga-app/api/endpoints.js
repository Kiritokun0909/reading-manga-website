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
  GET_MANGA_INFO: "/manga",
  GET_MANGA_CHAPTERS: "/chapter/list",
  GET_MANGA_REVIEWS: "/manga/reviews",
  CHECK_USER_LIKE: "/account/is-like",
  CHECK_USER_FOLLOW: "/account/is-follow",
  GET_CHAPTER_DETAIL: "/chapter",

  // Account
  GET_USER_INFO: "/account/0",
  UPDATE_USER_INFO: "/account/",
  UPDATE_USER_EMAIL: "/account/change-email",
  UPDATE_USER_PASSWORD: "/account/change-password",
  GET_LIKE_LIST: "/account/like-list",
  GET_FOLLOW_LIST: "/account/follow-list",
  GET_NOTIFICATION: "/account/notification",
  READ_NOTIFICATION: "/account/read-notification",
  LIKE_MANGA: "/account/like",
  FOLLOW_MANGA: "/account/follow",
  POST_REVIEW: "/account/add-review",
  GET_PURCHASED_PLANS: "/plan/history",

  // Plan
  GET_LIST_PLANS: "/plan/list-by-manga",
  GET_PLAN_INFO: "/plan",
  BUY_PLAN: "/plan/buy",

  //Payment
  GET_PAYMENT_SHEET: "/payment/payment-sheet",
  CONFIRM_PAYMENT: "/payment/confirm-payment",
};
