const xss = require("xss");
/**
 * Sanitize request body, params and query
 * against XSS attacks
 */
const sanitizeXSS = (req, res, next) => {
  const sanitizeObject = (obj) => {
    if (!obj) return;

    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === "string") {
        obj[key] = xss(obj[key]);
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    });
  };

  sanitizeObject(req.body);

  sanitizeObject(req.params);

  sanitizeObject(req.query);

  next();
};

module.exports = {
  sanitizeXSS,
};
