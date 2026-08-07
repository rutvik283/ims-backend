const asyncHandler = require("../middlewares/asynchandler.middleware");
const productService = require("../services/product.service");
const { sendSuccess, sendCreated } = require("../utils/response");
const { MESSAGES } = require("../constants");

/**
 * Create Product
 * POST /api/v1/products
 */
const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct({
    ...req.body,
    createdBy: req.user.id,
  });

  return sendCreated(res, {
    message: MESSAGES.PRODUCT.CREATED,
    data: product,
  });
});

/**
 * Get All Products
 * GET /api/v1/products
 */
const getProducts = asyncHandler(async (req, res) => {
  const result = await productService.getProducts(req.query);

  return sendSuccess(res, {
    message: MESSAGES.PRODUCT.FETCHED,
    data: result.results,
    meta: result.pagination,
  });
});

/**
 * Get Product By Id
 * GET /api/v1/products/:id
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);

  return sendSuccess(res, {
    message: MESSAGES.PRODUCT.DETAILS_FETCHED,
    data: product,
  });
});

/**
 * Update Product
 * PATCH /api/v1/products/:id
 */
const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);

  return sendSuccess(res, {
    message: MESSAGES.PRODUCT.UPDATED,
    data: product,
  });
});

/**
 * Delete Product
 * DELETE /api/v1/products/:id
 */
const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);

  return sendSuccess(res, {
    message: MESSAGES.PRODUCT.DELETED,
  });
});

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
