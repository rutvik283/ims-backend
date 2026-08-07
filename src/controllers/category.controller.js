const asyncHandler = require("../middlewares/asynchandler.middleware");

const categoryService = require("../services/category.service");

const {
  sendSuccess,
  sendCreated,
  sendNoContent,
} = require("../utils/response");

const { MESSAGES } = require("../constants");

/**
 * Create Category
 * POST /api/v1/categories
 */
const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory({
    ...req.body,
    createdBy: req.user.id,
  });

  return sendCreated(res, {
    message: MESSAGES.CATEGORY.CREATED,
    data: category,
  });
});

/**
 * Get All Categories
 * GET /api/v1/categories
 */
const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getCategories();

  return sendSuccess(res, {
    message: MESSAGES.CATEGORY.FETCHED,
    data: categories,
  });
});

/**
 * Get Category By Id
 * GET /api/v1/categories/:id
 */
const getCategoryById = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const categoryDetails = await categoryService.getCategoryById(req.params.id, {
    page,
    limit,
  });

  return sendSuccess(res, {
    message: MESSAGES.CATEGORY.DETAILS_FETCHED,
    data: categoryDetails,
  });
});

/**
 * Update Category
 * PATCH /api/v1/categories/:id
 */
const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(
    req.params.id,
    req.body,
  );

  return sendSuccess(res, {
    message: MESSAGES.CATEGORY.UPDATED,
    data: category,
  });
});

/**
 * Delete Category
 * DELETE /api/v1/categories/:id
 */
const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);

  return sendSuccess(res, {
    message: MESSAGES.CATEGORY.DELETED,
  });
});

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
