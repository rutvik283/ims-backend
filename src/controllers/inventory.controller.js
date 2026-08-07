const asyncHandler = require("../middlewares/asynchandler.middleware");
const inventoryService = require("../services/inventory.service");
const { sendSuccess } = require("../utils/response");
const { MESSAGES } = require("../constants");

/**
 * Adjust Stock
 * POST /api/v1/inventory
 */
const adjustStock = asyncHandler(async (req, res) => {
  const result = await inventoryService.adjustStock({
    ...req.body,
    performedBy: req.user.id,
  });

  return sendSuccess(res, {
    message: MESSAGES.INVENTORY.ADJUSTED,
    data: result,
  });
});

/**
 * Get All Transactions
 * GET /api/v1/inventory
 */
const getTransactions = asyncHandler(async (req, res) => {
  const result = await inventoryService.getTransactions(req.query);

  return sendSuccess(res, {
    message: MESSAGES.INVENTORY.FETCHED,
    data: result.results,
    meta: result.pagination,
  });
});

/**
 * Get Transactions for a Specific Product
 * GET /api/v1/inventory/product/:productId
 */
const getProductTransactions = asyncHandler(async (req, res) => {
  const result = await inventoryService.getProductTransactions(
    req.params.productId,
    req.query,
  );

  return sendSuccess(res, {
    message: MESSAGES.INVENTORY.FETCHED,
    data: result.results,
    meta: result.pagination,
  });
});

module.exports = {
  adjustStock,
  getTransactions,
  getProductTransactions,
};
