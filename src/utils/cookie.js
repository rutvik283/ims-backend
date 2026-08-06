const { COOKIE_OPTIONS } = require("../constants");

/**
 * Set authentication cookies
 */
const setAuthCookies = (res, { accessToken, refreshToken }) => {
  if (accessToken) {
    res.cookie("accessToken", accessToken, COOKIE_OPTIONS.ACCESS_TOKEN);
  }
  if (refreshToken) {
    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS.REFRESH_TOKEN);
  }
};

/**
 * Clear authentication cookies
 */
const clearAuthCookies = (res) => {
  res.clearCookie("accessToken", COOKIE_OPTIONS.ACCESS_TOKEN);
  res.clearCookie("refreshToken", COOKIE_OPTIONS.REFRESH_TOKEN);
};

module.exports = {
  setAuthCookies,
  clearAuthCookies,
};
