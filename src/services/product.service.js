const Product = require("../models/product.model");
const Category = require("../models/category.model");
const ApiError = require("../utils/ApiError");
const { HTTP_STATUS, MESSAGES } = require("../constants");
const validateObjectId = require("../utils/validateObjectId");
const { paginate } = require("../utils/paginate");

/**
 * Create Product
 */
const createProduct = async (data) => {
  const { name, sku, category, description, quantity, unitPrice, supplierName, createdBy } = data;

  // Validate category exists
  validateObjectId(category);
  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.CATEGORY.NOT_FOUND);
  }

  // Check for duplicate SKU
  const normalizedSku = sku.trim().toUpperCase();
  const existingProduct = await Product.findOne({ sku: normalizedSku });
  if (existingProduct) {
    throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.PRODUCT.ALREADY_EXISTS);
  }

  const product = await Product.create({
    name: name.trim(),
    sku: normalizedSku,
    category,
    description,
    quantity,
    unitPrice,
    supplierName: supplierName.trim(),
    createdBy,
  });

  return product;
};

/**
 * Get All Products (with search, filter, pagination)
 */
const getProducts = async (queryOptions = {}) => {
  const { search, category, status, supplierName, page, limit, sort } = queryOptions;

  // Build filter object
  const filter = {};

  // Search — regex match on name and sku
  if (search) {
    const searchRegex = new RegExp(search.trim(), "i");
    filter.$or = [{ name: searchRegex }, { sku: searchRegex }];
  }

  // Filter by category
  if (category) {
    filter.category = category;
  }

  // Filter by status
  if (status) {
    filter.status = status.toUpperCase();
  }

  // Filter by supplier name
  if (supplierName) {
    filter.supplierName = new RegExp(supplierName.trim(), "i");
  }

  // Build sort object
  let sortOption = { createdAt: -1 };
  if (sort) {
    const sortField = sort.startsWith("-") ? sort.slice(1) : sort;
    const sortOrder = sort.startsWith("-") ? -1 : 1;
    sortOption = { [sortField]: sortOrder };
  }

  const result = await paginate(Product, filter, {
    page,
    limit,
    sort: sortOption,
    populate: { path: "category", select: "name" },
  });

  return result;
};

/**
 * Get Product By Id
 */
const getProductById = async (productId) => {
  validateObjectId(productId);

  const product = await Product.findById(productId)
    .populate("category", "name")
    .lean();

  if (!product) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.PRODUCT.NOT_FOUND);
  }

  return product;
};

/**
 * Update Product
 */
const updateProduct = async (productId, payload) => {
  validateObjectId(productId);

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.PRODUCT.NOT_FOUND);
  }

  // If SKU is being changed, check for duplicates
  if (payload.sku) {
    const normalizedSku = payload.sku.trim().toUpperCase();
    const existingProduct = await Product.findOne({
      sku: normalizedSku,
      _id: { $ne: productId },
    });

    if (existingProduct) {
      throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.PRODUCT.ALREADY_EXISTS);
    }

    product.sku = normalizedSku;
  }

  // If category is being changed, validate it exists
  if (payload.category) {
    validateObjectId(payload.category);
    const categoryExists = await Category.findById(payload.category);
    if (!categoryExists) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.CATEGORY.NOT_FOUND);
    }
    product.category = payload.category;
  }

  if (payload.name !== undefined) {
    product.name = payload.name.trim();
  }

  if (payload.description !== undefined) {
    product.description = payload.description;
  }

  if (payload.quantity !== undefined) {
    product.quantity = payload.quantity;
  }

  if (payload.unitPrice !== undefined) {
    product.unitPrice = payload.unitPrice;
  }

  if (payload.supplierName !== undefined) {
    product.supplierName = payload.supplierName.trim();
  }

  // .save() triggers the pre-save hook which auto-sets status
  await product.save();

  return product;
};

/**
 * Delete Product
 */
const deleteProduct = async (productId) => {
  validateObjectId(productId);

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.PRODUCT.NOT_FOUND);
  }

  await product.deleteOne();

  return null;
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
