import { Router } from "express";
import { resendOtp, sendOtp, verifyOtp } from "./auth.controller";
const AuthRouter = Router();

AuthRouter.post("/send-otp", sendOtp);
AuthRouter.post("/verify-otp", verifyOtp);
AuthRouter.post("/resend-otp", resendOtp);

export default AuthRouter;
