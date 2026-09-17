import type { Request, Response } from "express";
import { BaseController } from "../../utils/catchAsync";
import paymentService from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import statusCode from "http-status-codes";
import Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/pirsma";
class PaymentController extends BaseController {
	createPayment = this.handle(async (req: Request, res: Response) => {
		const payload = req.body;
		const userId = req.user?.id as string;
		console.log("payload", payload);
		const result = await paymentService.createPaymentsDB(payload, userId);

		sendResponse(res, {
			message: "program found",
			status: statusCode.OK,
			success: true,
			data: result,
		});
	});

	confrimPayment = this.handle(async (req: Request, res: Response) => {
		const signature = req.headers["stripe-signature"];

		if (!signature) {
			throw new Error("Stripe signature is missing");
		}

		const event = Stripe.webhooks.constructEvent(
			req.body,
			signature,
			config.stripeWebhookSecret,
		);

		const result = await paymentService.confirmPaymentDB(event);

		sendResponse(res, {
			message: "payment success fully",
			status: statusCode.OK,
			success: true,
			data: result,
		});
	});

	getAllPaymetnUser = this.handle(async (req: Request, res: Response) => {
		const id = req.user?.id as string;

		const result = await paymentService.getALLPaymentStudent(id);

		sendResponse(res, {
			message: "payment found",
			status: statusCode.OK,
			success: true,
			data: result,
		});
	});

	getsinglePaymetnUser = this.handle(async (req: Request, res: Response) => {
		const id = req.params.id as string;

		const result = await paymentService.getSinglePaymentStudent(id);

		sendResponse(res, {
			message: "payment sigle found",
			status: statusCode.OK,
			success: true,
			data: result,
		});
	});
}

export default new PaymentController();
