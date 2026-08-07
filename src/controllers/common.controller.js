const asyncHandler = require("../middlewares/asynchandler.middleware");
const commonService = require("../services/common.service");
const { sendSuccess } = require("../utils/response");
const ApiError = require("../utils/ApiError");
const { HTTP_STATUS, MESSAGES } = require("../constants");

/**
 * Get Options
 * GET /api/v1/options?fields=categories,statuses
 */
const getOptions = asyncHandler(async (req, res) => {
  const { fields } = req.query;

  if (!fields || !fields.trim()) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      MESSAGES.OPTIONS.INVALID_FIELDS,
    );
  }

  const requestedFields = fields
    .split(",")
    .map((f) => f.trim().toLowerCase())
    .filter(Boolean);

  if (requestedFields.length === 0) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      MESSAGES.OPTIONS.INVALID_FIELDS,
    );
  }

  const options = await commonService.getOptions(requestedFields);

  return sendSuccess(res, {
    message: MESSAGES.OPTIONS.FETCHED,
    data: options,
  });
});

module.exports = {
  getOptions,
};
