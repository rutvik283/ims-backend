/**
 * HTTP Status Codes
 */
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

/**
 * User Roles
 */
const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
};

/**
 * Product Stock Status
 */
const STOCK_STATUS = {
  IN_STOCK: "IN_STOCK",
  LOW_STOCK: "LOW_STOCK",
  OUT_OF_STOCK: "OUT_OF_STOCK",
};

/**
 * Inventory Transaction Types
 */
const TRANSACTION_TYPE = {
  INCREASE: "INCREASE",
  DECREASE: "DECREASE",
};

/**
 * Common Response Messages
 */
const MESSAGES = {
  COMMON: {
    INVALID_ID: "Invalid resource id.",
  },

  AUTH: {
    REGISTER_SUCCESS: "User registered successfully.",
    LOGIN_SUCCESS: "Login successful.",
    LOGOUT_SUCCESS: "Logout successful.",
    INVALID_CREDENTIALS: "Invalid email or password.",
    USER_EXISTS: "User already exists.",
  },

  PRODUCT: {
    CREATED: "Product created successfully.",
    UPDATED: "Product updated successfully.",
    DELETED: "Product deleted successfully.",
    NOT_FOUND: "Product not found.",
  },

  CATEGORY: {
    ALREADY_EXISTS: "Category already exists.",
    NOT_FOUND: "Category not found.",
    CREATED: "Category created successfully.",
    UPDATED: "Category updated successfully.",
    DELETED: "Category deleted successfully.",
    FETCHED: "Categories fetched successfully.",
    DETAILS_FETCHED: "Category fetched successfully.",
  },

  VALIDATION: {
    FAILED: "Validation failed.",
  },

  SERVER: {
    ERROR: "Something went wrong. Please try again later.",
  },
};

const COOKIE_OPTIONS = {
  ACCESS_TOKEN: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  },

  REFRESH_TOKEN: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

const VALIDATION = {
  CATEGORY: {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
    DESCRIPTION_MAX_LENGTH: 500,
  },
};

module.exports = {
  HTTP_STATUS,
  ROLES,
  STOCK_STATUS,
  TRANSACTION_TYPE,
  MESSAGES,
  COOKIE_OPTIONS,
  VALIDATION,
};
