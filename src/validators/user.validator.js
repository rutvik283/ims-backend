const { z } = require("zod");
const { ROLES } = require("../constants");

const updateUserSchema = z.object({
  body: z
    .object({
      name: z
        .string({
          invalid_type_error: "Name must be a string.",
        })
        .trim()
        .min(3, "Name must contain at least 3 characters.")
        .max(50, "Name cannot exceed 50 characters.")
        .optional(),

      email: z
        .string({
          invalid_type_error: "Email must be a string.",
        })
        .trim()
        .email("Please provide a valid email address.")
        .toLowerCase()
        .optional(),

      role: z
        .enum([ROLES.ADMIN, ROLES.USER], {
          invalid_type_error: `Role must be either ${ROLES.ADMIN} or ${ROLES.USER}.`,
        })
        .optional(),

      isActive: z
        .boolean({
          invalid_type_error: "isActive must be a boolean.",
        })
        .optional(),
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: "Please provide at least one field to update.",
    }),
});

module.exports = {
  updateUserSchema,
};
