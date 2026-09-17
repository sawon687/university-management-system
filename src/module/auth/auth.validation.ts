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
        (value) =>
          value === "" ||
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        {
          message: "Email is not valid",
        }
      ),
          role: z.enum(["STUDENT"], {
      message: "Role must be STUDENT",
    }),


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

        if (value.length < 6) {
          ctx.addIssue({
            code: "custom",
            message: "Password must be at least 6 characters",
          });
        }
      }),

 departmentId: z
  .string()
  .trim()
  .uuid("Please select a valid department"),

  }),
});

export const authValidation = {
  userRegisterValidationSchema,
};
