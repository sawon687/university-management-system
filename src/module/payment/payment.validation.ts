import { z } from "zod";

export const createPaymentValidationSchema = z.object({
  body: z
    .object({
      applicationsId: z
        .string()
        .trim()
        .min(1, "Application ID is required")
        .optional(),

      feeId: z
        .string()
        .trim()
        .min(1, "Fee ID is required")
        .optional(),

      semesterFees: z
        .coerce
        .number()
        .positive("Semester fee must be greater than 0")
        .optional(),
    })
    .superRefine((data, ctx) => {

      if (!data.applicationsId && !data.feeId) {
        ctx.addIssue({
          code: "custom",
          message: "Either applicationsId or feeId is required",
        });
      }

  
      if (data.applicationsId && data.feeId) {
        ctx.addIssue({
          code: "custom",
          message:
            "You cannot provide applicationsId and feeId together",
        });
      }

    
      if (data.feeId && data.semesterFees === undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["semesterFees"],
          message: "Semester fees amount is required",
        });
      }


      if (data.applicationsId && data.semesterFees !== undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["semesterFees"],
          message:
            "semesterFees is not allowed for admission payment",
        });
      }
    }),
});


const paymentValidation={
    createPaymentValidationSchema
}