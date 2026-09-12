import {
  PaymentMethod,
  PaymentStatus,
  PaymentType,
} from "../../../generated/prisma/enums";
import { PaymentWhereInput } from "../../../generated/prisma/models";
import type Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/pirsma";
import { stripe } from "../../lib/stripe";
import { IPaymentReference } from "./payment.interface";

class PaymentService {
  async createPaymentsDB(payload: IPaymentReference, userId: string) {
    const { applicationsId, semesterEnrollmentId } = payload;

    if (applicationsId) {
      const admission = await prisma.admissionApplication.findUnique({
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

      // Optional but recommended
      if (admission.userId !== userId) {
        throw new Error("You are not allowed to pay for this admission");
      }

      const amount = admission.program.admissionFee;

      // Stripe call — transaction
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
      await prisma.payment.upsert({
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
    }

    if (semesterEnrollmentId) {
      // semester payment logic
    }

    throw new Error("Admission and semesterEnrollment id not provided");
  }
async confirmPaymentDB(event: Stripe.Event) {
  const session =event.data.object as Stripe.Checkout.Session;
   console.log('session',session,"event",event)
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
       
    

    return;
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
