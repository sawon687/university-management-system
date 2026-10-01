import { z } from "zod";

const userRegisterValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must not exceed 100 characters"),

    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .refine(
        (value) => value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        {
          message: "Email is not valid",
        },
      ),

    password: z
      .string()
      .trim()
      .superRefine((value, ctx) => {
        if (!value) {
          ctx.addIssue({
            code: "custom",
            message: "Password is required",
          });
          return;
        }

        if (value.length < 8) {
          ctx.addIssue({
            code: "custom",
            message: "Password must be at least 8 characters",
          });
        }
      }),
  }),
});

const resetPasswordSchema = z.object({
  body: z
    .object({
      token: z
        .string()
        .trim()
        .min(32, "Token is required"),

      email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .email("Email is not valid"),

      password: z
        .string()
        .min(8, "Password must be at least 8 characters"),

      confirmPassword: z
        .string()
        .min(8, "Confirm password must be at least 8 characters"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
});
export const authValidation = {
  userRegisterValidationSchema,
  resetPasswordSchema
};
