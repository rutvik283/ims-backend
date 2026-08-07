const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
const { HTTP_STATUS, MESSAGES } = require("../constants");

const sanitizeUser = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
};

/**
 * Register New User
 */
const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.AUTH.USER_EXISTS);
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  return sanitizeUser(user);
};

/**
 * Login User
 */
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({
    email,
  }).select("+password");

  if (!user) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      MESSAGES.AUTH.INVALID_CREDENTIALS,
    );
  }
  if (!user.isActive) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH.INACTIVE_USER);
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      MESSAGES.AUTH.INVALID_CREDENTIALS,
    );
  }

  const accessToken = generateAccessToken({
    userId: user._id,
    role: user.role,
  });
  const refreshToken = generateRefreshToken({
    userId: user._id,
    role: user.role,
  });

  return {
    accessToken,
    refreshToken,
    user: sanitizeUser(user),
  };
};

const getUserProfile = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.AUTH.USER_NOT_FOUND);
  }

  return sanitizeUser(user);
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
