import {
  AdmissionStatus,
  PaymentMethod,
  PaymentStatus,
  PaymentType,
  SemesterCode,
} from "../../../generated/prisma/enums";
import type Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/pirsma";
import { stripe } from "../../lib/stripe";
import { IPaymentReference } from "./payment.interface";


class PaymentService {
  async createPaymentsDB(payload: IPaymentReference, userId: string) {
    const { applicationsId, feeId, semesterFees} = payload;

    if (applicationsId) {
      return await prisma.$transaction(async (tx) => {
        const application = await tx.admissionApplication.findUnique({
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
          throw new Error("This Student Already pay");
        }

        if (application.userId !== userId) {
          throw new Error("You are not allowed to pay for this admission");
        }

        const amount = application.program.admissionFee;

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

    if (feeId) {
      if (semesterFees === undefined || semesterFees === null) {
        throw new Error("Semester fees amount is required");
      }

      return await prisma.$transaction(async (tx) => {
        const fees = await tx.fee.findUnique({
          where: {
            id: feeId,
          },
          include: {
            student: true,
          },
        });

        if (!fees) {
          throw new Error("This fees does not exist");
        }

        if (fees?.studentId !== userId) {
          throw new Error("You are not allowed to pay for this semesterFees");
        }

        const session = await stripe.checkout.sessions.create({
          mode: "payment",

          line_items: [
            {
              price_data: {
                currency: "bdt",
                product_data: {
                  name: "Semester Fees",
                },
                unit_amount: Math.round(Number(semesterFees) * 100),
              },
              quantity: 1,
            },
          ],

          customer_email: fees.student?.email,
          metadata: {
            enrolementId: fees.enroleMentId,
            userId: fees.studentId,
          },

          success_url: `${config.appurl}/payment/success?sessionId={CHECKOUT_SESSION_ID}`,

          cancel_url: `${config.appurl}/payment/cancel?sessionId={CHECKOUT_SESSION_ID}`,
        });

        // DB operation
        const existingPayment = await tx.payment.findFirst({
          where: {
            feeId: fees.id,
          },
        });

        if (existingPayment) {
          await tx.payment.update({
            where: {
              id: existingPayment.id,
            },
            data: {
              transactionId: session.id,
              paymentStatus: PaymentStatus.PENDING,
            },
          });
        } else {
          await tx.payment.create({
            data: {
              feeId: fees.id,
              userId,
              amount: semesterFees,
              paymentType: PaymentType.SEMESTER_FEE,
              paymentMethod: PaymentMethod.STRIPE,
              paymentStatus: PaymentStatus.PENDING,
              transactionId: session.id,
            },
          });
        }

        return {
          sessionId: session.id,
          paymentUrl: session.url,
        };
      });
    }

    throw new Error("Admission and semesterEnrollment id not provided");
  }
  async confirmPaymentDB(event: Stripe.Event) {
    const session = event.data.object as Stripe.Checkout.Session;
    const paymentExists = await prisma.payment.findUnique({
      where: {
        transactionId: session.id,
      },
    });

    if (!paymentExists) {
      throw new Error("This Pyment not found");
    }

    if (event.type === "checkout.session.completed") {
      if (
        paymentExists?.paymentStatus !== PaymentStatus.PAID &&
        paymentExists.paymentType == PaymentType.ADMISSION_FEE
      ) {
        await this.confirmAdmissionPayment(
          session,
          paymentExists.userId,
          paymentExists.id,
        );
      }
      if (
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

  private async confirmAdmissionPayment(
    session: Stripe.Checkout.Session,
    userId: string,
    paymentId: string,
  ) {
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
      const thirdRemaing = Math.max(thirdAmount - thirdPaid,0);

      const firstStatus =
        totalPaid >= firstAmout ? PaymentStatus.PAID : PaymentStatus.PENDING;

      const secandStatus =
        secandPaid >=secandAmount  ? PaymentStatus.PAID : PaymentStatus.PENDING;

      const thirdStatus =
       thirdPaid  >= thirdAmount ? PaymentStatus.PAID : PaymentStatus.PENDING;

  
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
}

export default new PaymentService();
