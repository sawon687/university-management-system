import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cookie from "cookie-parser";
import { authRouter } from "./module/auth/auth.routes";
import { studentRouter } from "./module/students/students.routes";
import { adminRouter } from "./module/admin/admin.routes";
import { teacherRouter } from "./module/teacher/teacher.route";
import { paymentRouter } from "./module/payment/payment.routes";
import PaymentController from "./module/payment/Payment.controller";
import { UserRoutes } from "./module/user/user.routes";
import { globalErrorHandler } from "./midileware/golobalError";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import config from "./config";

const app: Application = express();
app.set("trust proxy", 1);
app.use(
  cors({
    origin: config.appurl,
    credentials: true,
  }),
);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdn.tailwindcss.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
      },
    },
  }),
);
app.use(cookie());
app.use(
  "/api/v1/payments/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.confrimPayment,
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", async (req: Request, res: Response) => {
  res.send("University managementsystem");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", studentRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/teacher", teacherRouter);
app.use("/api/v1/payments/", paymentRouter);
app.use("/api/v1/user/", UserRoutes);
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src/templates"));
app.get("/google-login", (req, res) => {
  res.render("googlelogin");
});

app.use(globalErrorHandler);

export default app;
