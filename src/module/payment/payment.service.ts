import {
  AdmissionStatus,
  PaymentMethod,
  PaymentStatus,
  PaymentType,
  SemesterCode,
  UserStatus,
} from "../../../generated/prisma/enums";
import type Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/pirsma";
import { stripe } from "../../lib/stripe";
import type { IPaymentReference } from "./payment.interface";

class PaymentService {
  async createPaymentsDB(payload: IPaymentReference, userId: string) {
    const { applicationsId, feeId, semesterFees } = payload;
      console.log('payemtns',payload)
    // ==========================================
    // ADMISSION FEE PAYMENT
    // ==========================================
    if (applicationsId) {
      const application = await prisma.admissionApplication.findUnique({
        where: {
          id: applicationsId,
        },
        include: {
          program: true,
          user: true,
        },
      });

      if (!application) {
        throw new Error("This Admission does not exist");
      }

      if (application.status === AdmissionStatus.PAID) {
        throw new Error("This Student has already paid");
      }

      if (application.status !== AdmissionStatus.ACCEPTED) {
        throw new Error("Your application is not accepted");
      }

      if (application.userId !== userId) {
        throw new Error("You are not allowed to pay for this admission");
      }

      const amount = Number(application.program.admissionFee);

      if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("Invalid admission fee amount");
      }

      const existingPayment = await prisma.payment.findUnique({
        where: {
          admissionId: applicationsId,
        },
      });

      if (existingPayment?.paymentStatus === PaymentStatus.PAID) {
        throw new Error("This admission has already been paid");
      }

      // Create Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: application.user.email,
        line_items: [
          {
            price_data: {
              currency: "bdt",
              product_data: {
                name: `Admission Fee - ${application.program.name}`,
              },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          },
        ],
        metadata: {
          paymentType: PaymentType.ADMISSION_FEE,
          admissionId: application.id,
          userId,
        },
        success_url: `${config.appurl}/payment/success?sessionId={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.appurl}/payment/cancel?sessionId={CHECKOUT_SESSION_ID}`,
      });

      // Persist the exact Stripe session ID
      const savedPayment = await prisma.payment.upsert({
        where: {
          admissionId: applicationsId,
        },
        update: {
          transactionId: session.id,
          paymentStatus: PaymentStatus.PENDING,
          amount,
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
    }

    // ==========================================
    // SEMESTER FEE PAYMENT
    // ==========================================
  
if (feeId) {
  if (semesterFees === undefined || semesterFees === null) {
    throw new Error("Semester fees amount is required");
  }

  const fees = await prisma.fee.findUnique({
    where: {
      id: feeId,
    },
    include: {
      student: true,
    },
  });

  if (!fees) {
    throw new Error("This fee does not exist");
  }

  if (fees.studentId !== userId) {
    throw new Error(
      "You are not allowed to pay these semester fees",
    );
  }

  const amount = Number(semesterFees);
  const totalAmount = Number(fees.totalAmount);
  const remainingAmount = Number(fees.remainingAmount);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Invalid semester fee amount");
  }

  if (
    !Number.isFinite(totalAmount) ||
    !Number.isFinite(remainingAmount) ||
    totalAmount <= 0 ||
    remainingAmount < 0
  ) {
    throw new Error("Invalid semester fee data");
  }

  // Check whether the semester fee is fully paid
  if (remainingAmount <= 0) {
    throw new Error(
      "This semester amount has been totally paid",
    );
  }

  // Payment amount cannot exceed the remaining amount
  if (amount > remainingAmount) {
    throw new Error(
      `Payment amount exceeds remaining amount. Remaining amount: ${remainingAmount}`,
    );
  }

  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: fees.student?.email ?? undefined,
    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: {
            name: "Semester Fees",
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
    metadata: {
      paymentType: PaymentType.SEMESTER_FEE,
      feeId: fees.id,
      enrolementId: fees.enroleMentId,
      userId: fees.studentId,
    },
    success_url: `${config.appurl}/payment/success?sessionId={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.appurl}/payment/cancel?sessionId={CHECKOUT_SESSION_ID}`,
  });

  // Create a new payment record for every attempt
  const savedPayment = await prisma.payment.create({
    data: {
      feeId: fees.id,
      userId,
      amount,
      paymentType: PaymentType.SEMESTER_FEE,
      paymentMethod: PaymentMethod.STRIPE,
      paymentStatus: PaymentStatus.PENDING,
      transactionId: session.id,
    },
  });

  console.log("Semester session:", session.id);
  console.log("Semester payment:", savedPayment.id);
  console.log("Total amount:", totalAmount);
  console.log("Payment amount:", amount);
  console.log("Remaining before payment:", remainingAmount);
  console.log(
    "Remaining after successful payment:",
    Number((remainingAmount - amount).toFixed(2)),
  );

  return {
    sessionId: session.id,
    paymentUrl: session.url,
    totalAmount,
    paymentAmount: amount,
    remainingAmount,
    remainingAfterPayment: Number(
      (remainingAmount - amount).toFixed(2),
    ),
  };
}

throw new Error("Admission ID or fee ID must be provided");

  
  }

  async confirmPaymentDB(event: Stripe.Event) {
    const session = event.data.object as Stripe.Checkout.Session;

    // Ignore unrelated Stripe events
    if (
      event.type !== "checkout.session.completed" &&
      event.type !== "checkout.session.expired"
    ) {
      return;
    }

    const paymentExists = await prisma.payment.findUnique({
      where: {
        transactionId: session.id,
      },
    });

    if (!paymentExists) {
      console.error(
        `Payment not found for Stripe session: ${session.id}`,
        `Event type: ${event.type}`,
      );

      // Don't silently mark an unknown payment as successful.
      // Return normally to acknowledge the event and avoid endless retries.
      return;
    }

    if (event.type === "checkout.session.expired") {
      if (paymentExists.paymentStatus === PaymentStatus.PENDING) {
        await prisma.payment.update({
          where: {
            id: paymentExists.id,
          },
          data: {
            paymentStatus: PaymentStatus.CANCELLED,
          },
        });
      }

      return;
    }

    // A completed Checkout Session is not necessarily paid.
    if (session.payment_status !== "paid") {
      console.warn(`Checkout session is completed but not paid: ${session.id}`);
      return;
    }

    // Idempotency: don't process an already-paid payment again.
    if (paymentExists.paymentStatus === PaymentStatus.PAID) {
      return;
    }

    if (paymentExists.paymentType === PaymentType.ADMISSION_FEE) {
      await this.confirmAdmissionPayment(
        session,
        paymentExists.userId,
        paymentExists.id,
      );
    } else if (
      paymentExists.paymentType === PaymentType.SEMESTER_FEE &&
      paymentExists.feeId
    ) {
      await this.confirmSemesterPayment(
        paymentExists.feeId,
        session,
        paymentExists.id,
      );
    }
  }
  private async confirmAdmissionPayment(
    session: Stripe.Checkout.Session,
    userId: string,
    paymentId: string,
  ) {
    console.log("payment id", paymentId);
    console.log("session id", session);
    const paymentExists = await prisma.payment.findUnique({
      where: {
        id: paymentId,
      },
    });

    if (!paymentExists) {
      throw new Error("this payment not found");
    }
    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: {
          transactionId: session.id,
        },
        data: {
          paymentStatus: PaymentStatus.PAID,
          paidAt: new Date(),
        },
      });

      // Admission payment paid
      const admission = await tx.admissionApplication.update({
        where: {
          userId,
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

      const semester = await tx.semester.findUnique({
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
      const courses = await tx.course.findMany({
        where: {
          programId: admission.programId,
          semesterNumber,
        },
        select: {
          id: true,
          credit: true,
        },
      });

      if (!courses) {
        throw new Error("now corses for semester");
      }

      console.log("corses", courses);
      // Create enrollment with courses
      const enrollment = await tx.enrollment.create({
        data: {
          semesterId: semester.id,
          studentId: userId,

          Enrolementcourses: {
            createMany: {
              data: courses.map((course) => ({
                courseId: course.id,
              })),
            },
          },
        },
      });

      await tx.users.update({
        where: {
          id: userId,
        },
        data: {
          isEnrolled: true,
          userStatus: UserStatus.ACTIVE,
        },
      });
      console.log("enrolement", enrollment);

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
      const fee = await tx.fee.create({
        data: {
          studentId: paymentExists.userId,
          semesterId: enrollment.semesterId,
          enroleMentId: enrollment.id,

          feeType: PaymentType.SEMESTER_FEE,

          totalCredit,
          totalAmount,
          perCreditRate: perCreditFee,
          firstInstallmentAmount: perInstallmentAmount,
          secondInstallmentAmount: perInstallmentAmount,
          thirdInstallmentAmount: perInstallmentAmount,
          remainingAmount: totalAmount,
          firstInstallmentRemainingAmount: perInstallmentAmount,
          secondInstallmentRemainingAmount: perInstallmentAmount,
          thirdInstallmentRemainingAmount: perInstallmentAmount,
        },
      });

      return {
        payment: paymentExists,
        admission,
        semester,
        enrollment,
        fee,
      };
    });
  }

  private async confirmSemesterPayment(
    feeId: string,
    session: Stripe.Checkout.Session,
    paymentId: string,
  ) {
    const paymentExists = await prisma.payment.findUnique({
      where: { id: paymentId },
    });
    if (!paymentExists) {
      throw new Error("This payment not found");
    }

    const fees = await prisma.fee.findUnique({
      where: { id: feeId },
    });
    if (!fees) {
      throw new Error("This Fees not found");
    }
    return await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: {
          transactionId: session.id,
        },
        data: {
          paymentStatus: PaymentStatus.PAID,
          paidAt: new Date(),
        },
      });
      const feesId = fees.id as string;
      const paidAggregrate = await tx.payment.aggregate({
        where: {
          feeId: feesId,
          paymentStatus: PaymentStatus.PAID,
        },
        _sum: {
          amount: true,
        },
      });

      const totalPaid = paidAggregrate._sum.amount ?? 0;

      const totalAmount = Number(fees.totalAmount);
      const remainingAmount = Math.max(totalAmount - totalPaid, 0);

      const firstAmout = Number(fees.firstInstallmentAmount);

      const firstRemaing = Math.max(firstAmout - totalPaid, 0);

      const secandAmount = Number(fees.secondInstallmentAmount);
      const secandPaid = Math.max(totalPaid - firstAmout, 0);
      const secandRemaing = Math.max(secandAmount - secandPaid, 0);

      const thirdAmount = Number(fees.thirdInstallmentAmount);
      const thirdPaid = Math.max(totalPaid - (firstAmout + secandPaid), 0);
      const thirdRemaing = Math.max(thirdAmount - thirdPaid, 0);

      const firstStatus =
        totalPaid >= firstAmout ? PaymentStatus.PAID : PaymentStatus.PENDING;

      const secandStatus =
        secandPaid >= secandAmount ? PaymentStatus.PAID : PaymentStatus.PENDING;

      const thirdStatus =
        thirdPaid >= thirdAmount ? PaymentStatus.PAID : PaymentStatus.PENDING;

      await tx.fee.update({
        where: { id: feesId },
        data: {
          firstInstallmentStatus: firstStatus,
          firstInstallmentRemainingAmount: firstRemaing,
          secondInstallmentStatus: secandStatus,
          secondInstallmentRemainingAmount: secandRemaing,
          thirdInstallmentStatus: thirdStatus,
          thirdInstallmentRemainingAmount: thirdRemaing,
          remainingAmount: remainingAmount,
        },
      });
    });
  }

  async getALLPaymentStudent(id: string) {
    const result = await prisma.payment.findMany({
      where: { userId: id },
      include: {
        user: true,
      },
    });
    return result;
  }

  async getSinglePaymentStudent(id: string) {
    const result = await prisma.payment.findUnique({ where: { id } });
    return result;
  }
}

export default new PaymentService();
