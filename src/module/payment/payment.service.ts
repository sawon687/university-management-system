import {
  AdmissionStatus,
  PaymentMethod,
  PaymentStatus,
  PaymentType,
  SemesterCode,
} from "../../../generated/prisma/enums";
import { PaymentWhereInput } from "../../../generated/prisma/models";
import type Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/pirsma";
import { stripe } from "../../lib/stripe";
import { IPaymentReference } from "./payment.interface";
import { Prisma } from "../../../generated/prisma/client";

class PaymentService {
  async createPaymentsDB(payload: IPaymentReference, userId: string) {
    const { applicationsId, semesterEnrollmentId } = payload;

    if (applicationsId) {
      return await prisma.$transaction(async (tx) => {
        const admission = await tx.admissionApplication.findUnique({
          where: {
            id: applicationsId,
          },
          include: {
            program: true,
            user: true,
          },
        });

        if (!admission) {
          throw new Error("This Admission does not exist");
        }

        if (admission.userId !== userId) {
          throw new Error("You are not allowed to pay for this admission");
        }

        const amount = admission.program.admissionFee;

        const session = await stripe.checkout.sessions.create({
          mode: "payment",

          line_items: [
            {
              price_data: {
                currency: "bdt",
                product_data: {
                  name: "Admission Fee",
                },
                unit_amount: Math.round(Number(amount) * 100),
              },
              quantity: 1,
            },
          ],

          customer_email: admission.user.email,

          metadata: {
            admissionId: admission.id,
            userId: admission.user.id,
          },

          success_url: `${config.appurl}/payment/success?sessionId={CHECKOUT_SESSION_ID}`,

          cancel_url: `${config.appurl}/payment/cancel?sessionId={CHECKOUT_SESSION_ID}`,
        });

        // DB operation
        await tx.payment.upsert({
          where: {
            admissionId: applicationsId,
          },

          update: {
            transactionId: session.id,
            paymentStatus: PaymentStatus.PENDING,
          },

          create: {
            admissionId: applicationsId,
            userId,
            amount,
            paymentType: PaymentType.ADMISSION_FEE,
            paymentMethod: PaymentMethod.STRIPE,
            paymentStatus: PaymentStatus.PENDING,
            transactionId: session.id,
          },
        });

        return {
          sessionId: session.id,
          paymentUrl: session.url,
        };
      });
    }

    if (semesterEnrollmentId) {
      // semester payment logic
      //       return await prisma.$transaction(async (tx) => {
      //   const admission = await tx.fee.findUnique({
      //     where: {
      //       id: applicationsId,
      //     },
      //     include: {
      //       program: true,
      //       user: true,
      //     },
      //   });

      //   if (!admission) {
      //     throw new Error("This Admission does not exist");
      //   }

      //   if (admission.userId !== userId) {
      //     throw new Error("You are not allowed to pay for this admission");
      //   }

      //   const amount = admission.program.admissionFee;

      //   const session = await stripe.checkout.sessions.create({
      //     mode: "payment",

      //     line_items: [
      //       {
      //         price_data: {
      //           currency: "bdt",
      //           product_data: {
      //             name: "Admission Fee",
      //           },
      //           unit_amount: Math.round(Number(amount) * 100),
      //         },
      //         quantity: 1,
      //       },
      //     ],

      //     customer_email: admission.user.email,

      //     metadata: {
      //       admissionId: admission.id,
      //       userId: admission.user.id,
      //     },

      //     success_url: `${config.appurl}/payment/success?sessionId={CHECKOUT_SESSION_ID}`,

      //     cancel_url: `${config.appurl}/payment/cancel?sessionId={CHECKOUT_SESSION_ID}`,
      //   });

      //   // DB operation
      //   await tx.payment.upsert({
      //     where: {
      //       admissionId: applicationsId,
      //     },

      //     update: {
      //       transactionId: session.id,
      //       paymentStatus: PaymentStatus.PENDING,
      //     },

      //     create: {
      //       admissionId: applicationsId,
      //       userId,
      //       amount,
      //       paymentType: PaymentType.ADMISSION_FEE,
      //       paymentMethod: PaymentMethod.STRIPE,
      //       paymentStatus: PaymentStatus.PENDING,
      //       transactionId: session.id,
      //     },
      //   });

      //   return {
      //     sessionId: session.id,
      //     paymentUrl: session.url,
      //   };
      // });
      
    }

    throw new Error("Admission and semesterEnrollment id not provided");
  }
  async confirmPaymentDB(event: Stripe.Event) {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("session", session, "event", event);
    const paymentExists = await prisma.payment.findUnique({
      where: {
        transactionId: session.id,
      },
    });

    if (!paymentExists) {
      return;
    }

    if (
      event.type === "checkout.session.completed" &&
      paymentExists.paymentStatus !== PaymentStatus.PAID
    ) {
     await prisma.payment.update({
    where: {
      transactionId: session.id,
    },
    data: {
      paymentStatus: PaymentStatus.PAID,
      paidAt: new Date(),
    },
  });

  // Admission payment paid
  const admission = await prisma.admissionApplication.update({
    where: {
      userId: paymentExists.userId,
    },
    data: {
      status: AdmissionStatus.PAID,
    },
    include: {
      program: {
        select: {
          perCreditFee: true,
        },
      },
    },
  });

  // Current academic semester
  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  let name: SemesterCode;

  if (month >= 1 && month <= 4) {
    name = SemesterCode.SPRING;
  } else if (month >= 5 && month <= 8) {
    name = SemesterCode.SUMMER;
  } else {
    name = SemesterCode.FALL;
  }

  const semester = await prisma.semester.findUnique({
    where: {
      name_year: {
        name,
        year,
      },
    },
  });

  if (!semester) {
    throw new Error("Current academic semester not found");
  }

  // New student => first semester
  const semesterNumber = 1;

  // Get first semester courses
  const courses = await prisma.course.findMany({
    where: {
      programId: admission.programId,
      semesterNumber,
    },
    select: {
      id: true,
      credit: true,
    },
  });

  if (courses.length === 0) {
    throw new Error("No first semester courses found");
  }

  // Create enrollment with courses
  const enrollment = await prisma.enrollment.create({
    data: {
      semesterId: semester.id,
      studentId: paymentExists.userId,

      Enrolementcourses: {
        createMany: {
          data: courses.map((course) => ({
            courseId: course.id,
          })),
        },
      },
    },
  });

  // Calculate total credit
  const totalCredit = courses.reduce(
    (sum, course) => sum + course.credit,
    0,
  );

  // Program's per-credit fee
  const perCreditFee = Number(admission.program.perCreditFee);

  // Total semester fee
  const totalAmount = totalCredit * perCreditFee;

  // 3 installments
  const perInstallmentAmount = totalAmount / 3;

  // Create semester fee
  const fee = await prisma.fee.create({
    data: {
      studentId: paymentExists.userId,
      semesterId: enrollment.semesterId,

      feeType: PaymentType.SEMESTER_FEE,

      totalCredit,
      totalAmount,
      perCreditRate:perCreditFee,
      firstInstallmentAmount: perInstallmentAmount,
      secondInstallmentAmount: perInstallmentAmount,
      thirdInstallmentAmount: perInstallmentAmount,
    },
  });

  return {
    payment: paymentExists,
    admission,
    semester,
    enrollment,
    fee,
  };
    }

    

    if (
      event.type === "checkout.session.expired" &&
      paymentExists.paymentStatus === PaymentStatus.PENDING
    ) {
      await prisma.payment.update({
        where: {
          transactionId: session.id,
        },
        data: {
          paymentStatus: PaymentStatus.CANCELLED,
        },
      });
    }
  }
}

export default new PaymentService();
