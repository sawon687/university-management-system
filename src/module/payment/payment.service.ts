import { PaymentWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/pirsma";
import { stripe } from "../../lib/stripe";
import { IPaymentReference } from "./payment.interface";

class PaymentService {
  async createPayments(paylaod: IPaymentReference) {
    const { admissionId, semesterEnrollmentId } = paylaod;
    let paymentReferenceId;
    let admission;
    let enrollment;
    if (admissionId) {
      paymentReferenceId = paylaod.admissionId;
      admission = await prisma.admissionApplication.findUnique({
        where: { id: paymentReferenceId },
      });
    } else if (semesterEnrollmentId) {
      paymentReferenceId = paylaod.semesterEnrollmentId;
    } else {
      throw new Error("Admisstion and semsterEnrollment id not provider");
    }

    const result = await prisma.$transaction(async (tx) => {
      if (admissionId) {
        const admissionExits = await prisma.admissionApplication.findUnique({
          where: { id: admissionId },
          include: {
            program: true,
            user: true,
          },
        });
        if (!admissionExits) {
          throw new Error("This Admission doesnot Exits");
        }

        const session = await stripe.checkout.sessions.create({
          mode: "payment",

          line_items: [
            {
              price_data: {
                currency: "bdt",
                product_data: {
                  name: "FixItNow Service Booking",
                },
                unit_amount: Math.round(admissionExits.program.admissionFee),
              },
              quantity: 1,
            },
          ],

          customer_email: admissionExits.user.email,

          metadata: {
            bookingId: admissionExits.id,
            customerId: admissionExits.user.id,
          },

          //   success_url: `${config.appurl}/payment/success?sessionId={CHECKOUT_SESSION_ID}`,

          //   cancel_url: `${config.appurl}/payment/cancel?sessionId={CHECKOUT_SESSION_ID}`,
        });
      } else if (semesterEnrollmentId) {
        paymentReferenceId = paylaod.semesterEnrollmentId;
      } else {
        throw new Error("Admisstion and semsterEnrollment id not provider");
      }
    });
  }
  async confrirmPayments() {}
}

export default new PaymentService();
