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

      if (validatedData.body !== undefined) {
        req.body = validatedData.body;
      }

      if (validatedData.params !== undefined) {
        req.params = validatedData.params;
      }

      if (validatedData.query !== undefined) {
        req.query = validatedData.query;
      }

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
