class ApiError extends Error {
  constructor(statusCode, message, errors = [], stack = "") {
    super(message);

    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);

    if (stack) {
      this.stack = stack;
    }
  }
}

module.exports = ApiError;
