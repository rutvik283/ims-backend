const Product = require("../models/product.model");
const InventoryTransaction = require("../models/inventoryTransaction.model");
const ApiError = require("../utils/ApiError");
const { HTTP_STATUS, MESSAGES, TRANSACTION_TYPE } = require("../constants");
const validateObjectId = require("../utils/validateObjectId");
const { paginate } = require("../utils/paginate");
const appEmitter = require("../utils/eventEmitter");

/**
 * Adjust Stock (Increase or Decrease)
 */
const adjustStock = async ({ product: productId, type, quantity, performedBy }) => {
  validateObjectId(productId);

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.PRODUCT.NOT_FOUND);
  }

  const previousQuantity = product.quantity;

  // Validate sufficient stock for decrease
  if (type === TRANSACTION_TYPE.DECREASE) {
    if (product.quantity < quantity) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        MESSAGES.INVENTORY.INSUFFICIENT_STOCK,
      );
    }
  }

  // Calculate new quantity
  const newQuantity =
    type === TRANSACTION_TYPE.INCREASE
      ? previousQuantity + quantity
      : previousQuantity - quantity;

  // Update product quantity — .save() triggers pre-save hook for status
  product.quantity = newQuantity;
  await product.save();

  // Create transaction record
  const transaction = await InventoryTransaction.create({
    product: productId,
    type,
    quantity,
    previousQuantity,
    newQuantity,
    performedBy,
  });

  appEmitter.emit("inventoryUpdated");

  return {
    product,
    transaction,
  };
};

/**
 * Get All Transactions (with filter & pagination)
 */
const getTransactions = async (queryOptions = {}) => {
  const { product, type, performedBy, page, limit } = queryOptions;

  const filter = {};

  if (product) {
    filter.product = product;
  }

  if (type) {
    filter.type = type.toUpperCase();
  }

  if (performedBy) {
    filter.performedBy = performedBy;
  }

  const result = await paginate(InventoryTransaction, filter, {
    page,
    limit,
    sort: { createdAt: -1 },
    populate: [
      { path: "product", select: "name sku" },
      { path: "performedBy", select: "name email" },
    ],
  });

  return result;
};

/**
 * Get Transactions for a Specific Product
 */
const getProductTransactions = async (productId, queryOptions = {}) => {
  validateObjectId(productId);

  // Verify product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.PRODUCT.NOT_FOUND);
  }

  const { page, limit } = queryOptions;

  const result = await paginate(
    InventoryTransaction,
    { product: productId },
    {
      page,
      limit,
      sort: { createdAt: -1 },
      populate: [{ path: "performedBy", select: "name email" }],
    },
  );

  return result;
};

module.exports = {
  adjustStock,
  getTransactions,
  getProductTransactions,
};
