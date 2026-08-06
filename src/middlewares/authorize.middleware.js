const ApiError = require("../utils/ApiError");

const { HTTP_STATUS, ROLES } = require("../constants");

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Authentication required.");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        "You do not have permission to perform this action.",
      );
    }

    next();
  };
};

module.exports = authorize;
