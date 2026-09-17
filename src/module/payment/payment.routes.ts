import { Router } from "express";
import PaymentController from "./Payment.controller";
import { auth } from "../../midileware/auth";

const router = Router();

router.post("/initiate", auth("STUDENT"), PaymentController.createPayment);
router.get("/", auth("STUDENT"), PaymentController.getAllPaymetnUser);
router.get("/:id", auth("STUDENT"), PaymentController.getsinglePaymetnUser);

export const paymentRouter = router;
