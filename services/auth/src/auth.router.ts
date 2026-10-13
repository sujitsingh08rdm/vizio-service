import { Router } from "express";
import { resendOtp, sendOtp, signup, verifyOtp } from "./auth.controller";
const AuthRouter = Router();

AuthRouter.post("/signup", signup);
AuthRouter.post("/send-otp", sendOtp);
AuthRouter.post("/verify-otp", verifyOtp);
AuthRouter.post("/resend-otp", resendOtp);

export default AuthRouter;
