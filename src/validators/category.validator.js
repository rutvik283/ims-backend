const { z } = require("zod");

const { VALIDATION } = require("../constants");

const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Category name is required.",
        invalid_type_error: "Category name must be a string.",
      })
      .trim()
      .min(VALIDATION.CATEGORY.NAME_MIN_LENGTH, {
        message: `Category name must be at least ${VALIDATION.CATEGORY.NAME_MIN_LENGTH} characters.`,
      })
      .max(VALIDATION.CATEGORY.NAME_MAX_LENGTH, {
        message: `Category name cannot exceed ${VALIDATION.CATEGORY.NAME_MAX_LENGTH} characters.`,
      }),

    description: z
      .string({
        invalid_type_error: "Description must be a string.",
      })
      .trim()
      .max(VALIDATION.CATEGORY.DESCRIPTION_MAX_LENGTH, {
        message: `Description cannot exceed ${VALIDATION.CATEGORY.DESCRIPTION_MAX_LENGTH} characters.`,
      })
      .optional()
      .or(z.literal("")),
  }),
});

const updateCategorySchema = z.object({
  body: z
    .object({
      name: z
        .string({
          invalid_type_error: "Category name must be a string.",
        })
        .trim()
        .min(VALIDATION.CATEGORY.NAME_MIN_LENGTH, {
          message: `Category name must be at least ${VALIDATION.CATEGORY.NAME_MIN_LENGTH} characters.`,
        })
        .max(VALIDATION.CATEGORY.NAME_MAX_LENGTH, {
          message: `Category name cannot exceed ${VALIDATION.CATEGORY.NAME_MAX_LENGTH} characters.`,
        })
        .optional(),

      description: z
        .string({
          invalid_type_error: "Description must be a string.",
        })
        .trim()
        .max(VALIDATION.CATEGORY.DESCRIPTION_MAX_LENGTH, {
          message: `Description cannot exceed ${VALIDATION.CATEGORY.DESCRIPTION_MAX_LENGTH} characters.`,
        })
        .optional()
        .or(z.literal("")),
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: "Please provide at least one field to update.",
    }),
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
};
