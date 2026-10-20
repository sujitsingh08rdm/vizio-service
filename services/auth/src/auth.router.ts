import { Router } from "express";
import {
  resendOtp,
  sendOtp,
  signup,
  verifyOtp,
  verifyToken,
} from "./auth.controller";
import { DtoMiddleware, IscMiddleware } from "./auth.middleware";
import {
  sendOtpDtoSchema,
  signupDtoSchema,
  verifyOtpDtoSchema,
  verifyTokenDtoSchema,
} from "./auth.dto";
const AuthRouter = Router();

AuthRouter.post("/signup", DtoMiddleware(signupDtoSchema), signup);
AuthRouter.post("/send-otp", DtoMiddleware(sendOtpDtoSchema), sendOtp);
AuthRouter.post("/verify-otp", DtoMiddleware(verifyOtpDtoSchema), verifyOtp);
AuthRouter.post("/resend-otp", DtoMiddleware(sendOtpDtoSchema), resendOtp);
AuthRouter.post(
  "/verify-token",
  IscMiddleware,
  DtoMiddleware(verifyTokenDtoSchema),
  verifyToken,
);

export default AuthRouter;
