const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const { HTTP_STATUS, MESSAGES } = require("../constants");
const validateObjectId = require("../utils/validateObjectId");
const { paginate } = require("../utils/paginate");

const sanitizeUser = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

/**
 * Get All Users (with search, filter, pagination)
 */
const getUsers = async (queryOptions = {}) => {
  const { search, role, isActive, page, limit } = queryOptions;

  const filter = {};

  // Search by name or email
  if (search) {
    const searchRegex = new RegExp(search.trim(), "i");
    filter.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  // Filter by role
  if (role) {
    filter.role = role.toUpperCase();
  }

  // Filter by active status
  if (isActive !== undefined) {
    filter.isActive = isActive === "true";
  }

  const result = await paginate(User, filter, {
    page,
    limit,
    sort: { createdAt: -1 },
  });

  return {
    results: result.results.map(sanitizeUser),
    pagination: result.pagination,
  };
};

/**
 * Update User Details
 */
const updateUser = async (userId, payload) => {
  validateObjectId(userId);

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER.NOT_FOUND);
  }

  // If email is being changed, check for duplicates
  if (payload.email) {
    const normalizedEmail = payload.email.trim().toLowerCase();
    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: userId },
    });

    if (existingUser) {
      throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.USER.EMAIL_EXISTS);
    }

    user.email = normalizedEmail;
  }

  if (payload.name !== undefined) {
    user.name = payload.name.trim();
  }

  if (payload.role !== undefined) {
    user.role = payload.role;
  }

  if (payload.isActive !== undefined) {
    user.isActive = payload.isActive;
  }

  await user.save();

  return sanitizeUser(user);
};

/**
 * Delete User
 */
const deleteUser = async (userId, currentUserId) => {
  validateObjectId(userId);

  // Prevent self-deletion
  if (userId.toString() === currentUserId.toString()) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      MESSAGES.USER.CANNOT_DELETE_SELF,
    );
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER.NOT_FOUND);
  }

  await user.deleteOne();

  return null;
};

module.exports = {
  getUsers,
  updateUser,
  deleteUser,
};
