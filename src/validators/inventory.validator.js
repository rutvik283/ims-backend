const { z } = require("zod");

const { TRANSACTION_TYPE } = require("../constants");

const adjustStockSchema = z.object({
  body: z.object({
    product: z
      .string({
        required_error: "Product ID is required.",
        invalid_type_error: "Product ID must be a string.",
      })
      .trim()
      .min(1, { message: "Product ID is required." }),

    type: z.enum([TRANSACTION_TYPE.INCREASE, TRANSACTION_TYPE.DECREASE], {
      required_error: "Transaction type is required.",
      invalid_type_error: `Transaction type must be either ${TRANSACTION_TYPE.INCREASE} or ${TRANSACTION_TYPE.DECREASE}.`,
    }),

    quantity: z
      .number({
        required_error: "Quantity is required.",
        invalid_type_error: "Quantity must be a number.",
      })
      .int({ message: "Quantity must be a whole number." })
      .min(1, { message: "Quantity must be at least 1." }),
  }),
});

module.exports = {
  adjustStockSchema,
};
