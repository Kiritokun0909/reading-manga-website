// src/utilities/HandleCode.js

module.exports = {
  // Path to save file to Firebase storage
  FB_AUTHOR_AVATAR_FOLDER_PATH: "author_avatar",
  FB_USER_AVATAR_FOLDER_PATH: "user_avatar",
  FB_COVER_IMAGE_FOLDER_PATH: "cover_image",
  FB_CHAPTER_IMAGE_FOLDER_PATH: "chapter_image",

  //Role enum
  ROLE_ADMIN: 1,
  ROLE_USER: 2,

  //Handle code for document type
  DOC_TYPE_POLICY: "policy",
  DOC_TYPE_ABOUT: "about",

  //Handle code for reviews
  REVIEW_IS_HIDE: 1,
  REVIEW_NOT_HIDE: 0,

  //Handle code for plan
  CAN_READ_ALL: 1,
  CANNOT_READ_ALL: 0,
  BOUGHT_BY_USER: 6001,

  //Handle code for payment status
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",

  // Handle code for common service
  CREATE_SUCCESS: 900,
  CREATE_FAILED: 901,

  NO_FIELDS_TO_UPDATE: 902,
  UPDATE_SUCCESS: 903,
  UPDATE_FAILED: 904,

  DELETE_SUCCESS: 905,
  DELETE_FAILED: 906,

  GET_SUCCESS: 907,
  GET_FAILED: 908,

  NOT_FOUND: 909,

  // Handle code for auth service
  ACTIVE_STATUS: "active",
  BAN_STATUS: "blocked",
  LOGIN_FAILED: 1000,
  ACCOUNT_BANNED: 1001,
  LOGIN_SUCCESS: 1002,

  // Handle code for user service
  EMAIL_EXIST: 2002,
  PASSWORD_NOT_MATCH: 2006,
  USER_ALREADY_LIKE: 2007,
  USER_ALREADY_FOLLOW: 2008,

  // Handle code for genre service
  GENRE_EXIST: 3000,

  //Handle code for author service
  FILTER_BY_AUTHOR_UPDATE_DATE_DESC: 4000,
  FILTER_BY_AUTHOR_UPDATE_DATE_ASC: 4001,
  FILTER_BY_AUTHOR_NAME_ASC: 4002,
  FILTER_BY_AUTHOR_NAME_DESC: 4003,

  // Handle code for manga service
  MANGA_IS_FREE: 1,
  MANGA_NOT_FREE: 0,
  IS_HIDE: 1,
  NOT_HIDE: 0,
  FILTER_BY_MANGA_UPDATE_DATE_DESC: 5000,
  FILTER_BY_MANGA_UPDATE_DATE_ASC: 5001,
  FILTER_BY_MANGA_VIEW_ASC: 5004,
  FILTER_BY_MANGA_VIEW_DESC: 5005,
  FILTER_BY_MANGA_LIKE_ASC: 5006,
  FILTER_BY_MANGA_LIKE_DESC: 5007,
  FILTER_BY_MANGA_CREATE_DATE_DESC: 5008,
  FILTER_BY_MANGA_CREATE_DATE_ASC: 5009,

  // Handle code for subscription service
  FILTER_BY_UPDATE_DATE_DESC: 6000,
  FILTER_BY_UPDATE_DATE_ASC: 6001,
  FILTER_BY_CREATE_DATE_DESC: 6002,
  FILTER_BY_CREATE_DATE_ASC: 6003,

  //Handle code for payment status
  PAYMENT_PENDING: "pending",
  PAYMENT_COMPLETED: "completed",
  PAYMENT_FAILED: "failed",
};
