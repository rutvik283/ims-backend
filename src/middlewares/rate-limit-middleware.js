const { rateLimit } = require("express-rate-limit");

const createRateLimiter = ({
  windowMs,
  limit,
  message = "Too many requests. Please try again later.",
}) => {
  return rateLimit({
    windowMs,
    limit,

    standardHeaders: "draft-8",
    legacyHeaders: false,

    message: {
      success: false,
      message,
    },

    statusCode: 429,
  });
};

const globalRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  message: "Too many requests. Please try again later.",
});

const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: "Too many authentication attempts. Please try again later.",
});

module.exports = {
  globalRateLimiter,
  authRateLimiter,
};
