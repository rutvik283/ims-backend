const ApiError = require("../utils/ApiError");

const { HTTP_STATUS, MESSAGES } = require("../constants");

const errorHandler = (err, req, res, next) => {
  let error = err;

  /*
    If error is not our custom ApiError,
    convert it into ApiError
  */

  if (!(error instanceof ApiError)) {
    error = new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      MESSAGES.SERVER.ERROR,
      [],
      err.stack,
    );
  }

  /*
    MongoDB Duplicate Key Error

    Example:
    email already exists
    SKU already exists
  */

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];

    error = new ApiError(HTTP_STATUS.CONFLICT, `${field} already exists.`);
  }

  /*
    Mongoose Validation Error
  */

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((item) => ({
      field: item.path,
      message: item.message,
    }));

    error = new ApiError(HTTP_STATUS.BAD_REQUEST, "Validation failed.", errors);
  }

  /*
    JWT Errors
  */

  if (err.name === "JsonWebTokenError") {
    error = new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid token.");
  }

  if (err.name === "TokenExpiredError") {
    error = new ApiError(HTTP_STATUS.UNAUTHORIZED, "Token expired.");
  }

  return res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errors: error.errors || [],
    ...(process.env.NODE_ENV === "development" && {
      stack: error.stack,
    }),
  });
};

module.exports = errorHandler;
