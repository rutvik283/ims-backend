const mongoose = require("mongoose");
const Category = require("../models/category.model");
const Product = require("../models/product.model");
const ApiError = require("../utils/ApiError");
const { HTTP_STATUS, MESSAGES } = require("../constants");
const validateObjectId = require("../utils/validateObjectId");
const { paginate } = require("../utils/paginate");

/**
 * Create Category
 */
const createCategory = async ({ name, description, createdBy }) => {
  const normalizedName = name.trim().toLowerCase();
  const existingCategory = await Category.findOne({
    name: normalizedName,
  });

  if (existingCategory) {
    throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.CATEGORY.ALREADY_EXISTS);
  }

  const category = await Category.create({
    name: normalizedName,
    description,
    createdBy,
  });

  return category;
};

/**
 * Get All Categories
 */
const getCategories = async () => {
  return await Category.find().sort({ createdAt: -1 }).lean();
};

/**
 * Get Category By Id
 */
const getCategoryById = async (categoryId, paginationOptions = {}) => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.COMMON.INVALID_ID);
  }

  const category = await Category.findById(categoryId).lean();

  if (!category) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.CATEGORY.NOT_FOUND);
  }

  const paginatedProducts = await paginate(
    Product,
    { category: categoryId },
    paginationOptions
  );

  return {
    ...category,
    products: paginatedProducts.results,
    pagination: paginatedProducts.pagination,
  };
};

/**
 * Update Category
 */
const updateCategory = async (categoryId, payload) => {
  validateObjectId(categoryId);

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.CATEGORY.NOT_FOUND);
  }

  if (payload.name) {
    const normalizedName = payload.name.trim().toLowerCase();

    const existingCategory = await Category.findOne({
      name: normalizedName,
      _id: { $ne: categoryId },
    });

    if (existingCategory) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        MESSAGES.CATEGORY.ALREADY_EXISTS,
      );
    }

    category.name = normalizedName;
  }

  if (payload.description !== undefined) {
    category.description = payload.description;
  }

  await category.save();

  return category;
};

/**
 * Delete Category
 */
const deleteCategory = async (categoryId) => {
  validateObjectId(categoryId);

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.CATEGORY.NOT_FOUND);
  }

  await category.deleteOne();

  return null;
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
