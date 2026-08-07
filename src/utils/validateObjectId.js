const mongoose = require("mongoose");
const ApiError = require("./ApiError");
const { HTTP_STATUS, MESSAGES } = require("../constants");

module.exports = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.COMMON.INVALID_ID);
  }
};
