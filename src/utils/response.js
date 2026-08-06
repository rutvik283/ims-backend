const { HTTP_STATUS } = require("../constants");

const sendSuccess = (
  res,
  {
    statusCode = HTTP_STATUS.OK,
    message = "Success",
    data = null,
    meta = null,
  } = {},
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
};

const sendCreated = (
  res,
  { message = "Resource created successfully.", data = null, meta = null } = {},
) => {
  return res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message,
    data,
    meta,
  });
};

const sendNoContent = (res) => {
  return res.status(HTTP_STATUS.NO_CONTENT).send();
};

module.exports = {
  sendSuccess,
  sendCreated,
  sendNoContent,
};
