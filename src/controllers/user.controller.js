const asyncHandler = require("../middlewares/asynchandler.middleware");
const userService = require("../services/user.service");
const { sendSuccess } = require("../utils/response");
const { MESSAGES } = require("../constants");

/**
 * Get All Users
 * GET /api/v1/users
 */
const getUsers = asyncHandler(async (req, res) => {
  const result = await userService.getUsers(req.query);

  return sendSuccess(res, {
    message: MESSAGES.USER.FETCHED,
    data: result.results,
    meta: result.pagination,
  });
});

/**
 * Update User details
 * PATCH /api/v1/users/:id
 */
const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);

  return sendSuccess(res, {
    message: MESSAGES.USER.UPDATED,
    data: user,
  });
});

/**
 * Delete User
 * DELETE /api/v1/users/:id
 */
const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id, req.user.id);

  return sendSuccess(res, {
    message: MESSAGES.USER.DELETED,
  });
});

module.exports = {
  getUsers,
  updateUser,
  deleteUser,
};
