const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const { HTTP_STATUS } = require("../constants");
const { verifyAccessToken } = require("../utils/jwt");
const asyncHandler = require("./asynchandler.middleware");

const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Authentication required.");
  }

  const decoded = verifyAccessToken(token);

  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "User no longer exists.");
  }

  req.user = {
    id: user._id,
    role: user.role,
    email: user.email,
  };

  next();
});

module.exports = authenticate;
