const authService = require("../services/auth.service");
const { sendSuccess, sendCreated } = require("../utils/response");
const { MESSAGES } = require("../constants");
const { setAuthCookies, clearAuthCookies } = require("../utils/cookie");
const asyncHandler = require("../middlewares/asynchandler.middleware");

/**
 * Register User
 * POST /api/v1/auth/register
 */
const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);

  return sendCreated(res, {
    message: MESSAGES.AUTH.REGISTER_SUCCESS,

    data: user,
  });
});

/**
 * Login User
 * POST /api/v1/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);

  setAuthCookies(res, {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });

  return sendSuccess(res, {
    message: MESSAGES.AUTH.LOGIN_SUCCESS,
    data: {
      user: result.user,
    },
  });
});

/**
 * Logout User
 * POST /api/v1/auth/logout
 */
const logout = asyncHandler(async (req, res) => {
  clearAuthCookies(res);
  return sendSuccess(res, {
    message: MESSAGES.AUTH.LOGOUT_SUCCESS,
  });
});

const getMyProfile = asyncHandler(async (req, res) => {
  const user = await authService.getUserProfile(req.user.id);

  return sendSuccess(res, {
    message: MESSAGES.AUTH.PROFILE_SUCCESS,
    data: {
      user: user,
    },
  });
});

/**
 * Refresh Access Token
 * POST /api/v1/auth/refresh
 */
const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  const result = await authService.refreshAccessToken(refreshToken);

  setAuthCookies(res, {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });

  return sendSuccess(res, {
    message: "Token refreshed successfully.",
    data: {
      user: result.user,
    },
  });
});

module.exports = {
  register,
  login,
  getMyProfile,
  logout,
  refresh,
};
