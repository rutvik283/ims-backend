const { ZodError } = require("zod");
const ApiError = require("../utils/ApiError");
const { HTTP_STATUS, MESSAGES } = require("../constants");

const validate = (schema) => {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      req.body = validatedData.body;

      req.params = validatedData.params;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err) => ({
          field: err.path.join("."),

          message: err.message,
        }));

        return next(
          new ApiError(
            HTTP_STATUS.BAD_REQUEST,
            MESSAGES.VALIDATION.FAILED,
            errors,
          ),
        );
      }

      next(error);
    }
  };
};

module.exports = validate;
