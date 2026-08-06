const { z } = require("zod");

const registerSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Name is required.",
      })
      .trim()
      .min(3, "Name must contain at least 3 characters.")
      .max(50, "Name cannot exceed 50 characters."),

    email: z
      .string({
        required_error: "Email is required.",
      })
      .trim()
      .email("Please provide a valid email address.")
      .toLowerCase(),

    password: z
      .string({
        required_error: "Password is required.",
      })
      .min(8, "Password must contain at least 8 characters.")
      .max(32, "Password cannot exceed 32 characters."),
  }),

  params: z.object({}).optional(),

  query: z.object({}).optional(),
});

const loginSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required.",
      })
      .trim()
      .email("Please provide a valid email address.")
      .toLowerCase(),

    password: z
      .string({
        required_error: "Password is required.",
      })
      .min(1, "Password is required."),
  }),

  params: z.object({}).optional(),

  query: z.object({}).optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
};
