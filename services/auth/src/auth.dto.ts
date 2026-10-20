import { z } from "zod";

export const signupDtoSchema = z
  .object({
    fullname: z.string().min(1, "Fullname is required"),
    email: z.email("Enter a valid Email"),
    mobile: z.string().min(8, "Enter a Valid Mobile Number"),
  })
  .strict();

export const sendOtpDtoSchema = z
  .object({
    mobile: z.string().min(8, "Enter a Valid Mobile Number"),
  })
  .strict();

export const verifyOtpDtoSchema = z
  .object({
    mobile: z.string().min(8, "Enter a valid Mobile Number"),
    otp: z.number().gte(0, "Enter a valid Otp"),
  })
  .strict();

export const verifyTokenDtoSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
  })
  .strict();

export type SignupDto = z.infer<typeof signupDtoSchema>;
export type SendOtpDto = z.infer<typeof sendOtpDtoSchema>;
export type VerifyOtpDto = z.infer<typeof verifyOtpDtoSchema>;
export type VerifyTokenDto = z.infer<typeof verifyTokenDtoSchema>;
