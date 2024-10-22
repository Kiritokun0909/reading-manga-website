// src/utilities/HandleCode.js

module.exports = {
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
    LOGIN_FAILED: 1000,
    ACCOUNT_BANNED: 1001,
    LOGIN_SUCCESS: 1002,

    // Handle code for user service
    EMAIL_EXIST: 2002,
    PASSWORD_NOT_MATCH: 2006,

    // Handle code for genre service



    //Handle code for author service
    FILTER_BY_AUTHOR_UPDATE_DATE_DESC: 4000,
    FILTER_BY_AUTHOR_UPDATE_DATE_ASC: 4001,
    FILTER_BY_AUTHOR_NAME_ASC: 4002,
    FILTER_BY_AUTHOR_NAME_DESC: 4003,


}