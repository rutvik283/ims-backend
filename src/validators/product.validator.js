const { z } = require("zod");

const { VALIDATION } = require("../constants");

const createProductSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Product name is required.",
        invalid_type_error: "Product name must be a string.",
      })
      .trim()
      .min(VALIDATION.PRODUCT.NAME_MIN_LENGTH, {
        message: `Product name must be at least ${VALIDATION.PRODUCT.NAME_MIN_LENGTH} characters.`,
      })
      .max(VALIDATION.PRODUCT.NAME_MAX_LENGTH, {
        message: `Product name cannot exceed ${VALIDATION.PRODUCT.NAME_MAX_LENGTH} characters.`,
      }),

    sku: z
      .string({
        required_error: "SKU is required.",
        invalid_type_error: "SKU must be a string.",
      })
      .trim()
      .min(VALIDATION.PRODUCT.SKU_MIN_LENGTH, {
        message: `SKU must be at least ${VALIDATION.PRODUCT.SKU_MIN_LENGTH} characters.`,
      })
      .max(VALIDATION.PRODUCT.SKU_MAX_LENGTH, {
        message: `SKU cannot exceed ${VALIDATION.PRODUCT.SKU_MAX_LENGTH} characters.`,
      }),

    category: z
      .string({
        required_error: "Category is required.",
        invalid_type_error: "Category must be a string.",
      })
      .trim()
      .min(1, { message: "Category is required." }),

    description: z
      .string({
        invalid_type_error: "Description must be a string.",
      })
      .trim()
      .max(VALIDATION.PRODUCT.DESCRIPTION_MAX_LENGTH, {
        message: `Description cannot exceed ${VALIDATION.PRODUCT.DESCRIPTION_MAX_LENGTH} characters.`,
      })
      .optional()
      .or(z.literal("")),

    quantity: z
      .number({
        required_error: "Quantity is required.",
        invalid_type_error: "Quantity must be a number.",
      })
      .int({ message: "Quantity must be a whole number." })
      .min(0, { message: "Quantity cannot be negative." }),

    unitPrice: z
      .number({
        required_error: "Unit price is required.",
        invalid_type_error: "Unit price must be a number.",
      })
      .min(0, { message: "Unit price cannot be negative." }),

    supplierName: z
      .string({
        required_error: "Supplier name is required.",
        invalid_type_error: "Supplier name must be a string.",
      })
      .trim()
      .min(VALIDATION.PRODUCT.SUPPLIER_NAME_MIN_LENGTH, {
        message: `Supplier name must be at least ${VALIDATION.PRODUCT.SUPPLIER_NAME_MIN_LENGTH} characters.`,
      })
      .max(VALIDATION.PRODUCT.SUPPLIER_NAME_MAX_LENGTH, {
        message: `Supplier name cannot exceed ${VALIDATION.PRODUCT.SUPPLIER_NAME_MAX_LENGTH} characters.`,
      }),
  }),
});

const updateProductSchema = z.object({
  body: z
    .object({
      name: z
        .string({
          invalid_type_error: "Product name must be a string.",
        })
        .trim()
        .min(VALIDATION.PRODUCT.NAME_MIN_LENGTH, {
          message: `Product name must be at least ${VALIDATION.PRODUCT.NAME_MIN_LENGTH} characters.`,
        })
        .max(VALIDATION.PRODUCT.NAME_MAX_LENGTH, {
          message: `Product name cannot exceed ${VALIDATION.PRODUCT.NAME_MAX_LENGTH} characters.`,
        })
        .optional(),

      sku: z
        .string({
          invalid_type_error: "SKU must be a string.",
        })
        .trim()
        .min(VALIDATION.PRODUCT.SKU_MIN_LENGTH, {
          message: `SKU must be at least ${VALIDATION.PRODUCT.SKU_MIN_LENGTH} characters.`,
        })
        .max(VALIDATION.PRODUCT.SKU_MAX_LENGTH, {
          message: `SKU cannot exceed ${VALIDATION.PRODUCT.SKU_MAX_LENGTH} characters.`,
        })
        .optional(),

      category: z
        .string({
          invalid_type_error: "Category must be a string.",
        })
        .trim()
        .min(1, { message: "Category cannot be empty." })
        .optional(),

      description: z
        .string({
          invalid_type_error: "Description must be a string.",
        })
        .trim()
        .max(VALIDATION.PRODUCT.DESCRIPTION_MAX_LENGTH, {
          message: `Description cannot exceed ${VALIDATION.PRODUCT.DESCRIPTION_MAX_LENGTH} characters.`,
        })
        .optional()
        .or(z.literal("")),

      quantity: z
        .number({
          invalid_type_error: "Quantity must be a number.",
        })
        .int({ message: "Quantity must be a whole number." })
        .min(0, { message: "Quantity cannot be negative." })
        .optional(),

      unitPrice: z
        .number({
          invalid_type_error: "Unit price must be a number.",
        })
        .min(0, { message: "Unit price cannot be negative." })
        .optional(),

      supplierName: z
        .string({
          invalid_type_error: "Supplier name must be a string.",
        })
        .trim()
        .min(VALIDATION.PRODUCT.SUPPLIER_NAME_MIN_LENGTH, {
          message: `Supplier name must be at least ${VALIDATION.PRODUCT.SUPPLIER_NAME_MIN_LENGTH} characters.`,
        })
        .max(VALIDATION.PRODUCT.SUPPLIER_NAME_MAX_LENGTH, {
          message: `Supplier name cannot exceed ${VALIDATION.PRODUCT.SUPPLIER_NAME_MAX_LENGTH} characters.`,
        })
        .optional(),
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: "Please provide at least one field to update.",
    }),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
};
