import AuthModel from "./auth.model";
import axios from "axios";
import {
  AuthModelInterface,
  MessageInterface,
  VerifyOTPInterface,
} from "./auth.interface";
import jwt from "jsonwebtoken";
import {
  SendOtpDto,
  SignupDto,
  VerifyOtpDto,
  VerifyTokenDto,
} from "./auth.dto";
axios.defaults.baseURL = process.env.MSG_SERVER;

const getAccessToken = async (auth: AuthModelInterface): Promise<string> => {
  const payload = {
    id: auth._id,
    mobile: auth.mobile,
    email: auth.email,
    fullname: auth.fullname,
  };

  const expiresIn = parseInt(process.env.ACCESS_TOKEN_EXPIRY!);
  const secret = process.env.AUTH_SECRET!;

  const token = await jwt.sign(payload, secret, { expiresIn });
  return token;
};

export const signup = async (body: SignupDto): Promise<MessageInterface> => {
  await Promise.all([AuthModel.create(body), sendOtp({ mobile: body.mobile })]);
  return { message: "Signup success" };
};

export const sendOtp = async (body: SendOtpDto): Promise<MessageInterface> => {
  const auth = await AuthModel.find({ mobile: body.mobile });

  if (!auth) {
    throw new Error("User Not Found, Try to Sign up first");
  }

  return { message: "OTP send Succesfully" };
};

export const verifyOtp = async (
  body: VerifyOtpDto,
): Promise<VerifyOTPInterface> => {
  const auth = await AuthModel.findOne({ mobile: body.mobile }).lean();

  if (!auth) {
    throw new Error("User not found, Please sign up");
  }

  if (body.otp !== 1234) {
    throw new Error("Failed to verify OTP");
  }

  const accessToken = await getAccessToken(auth);

  return {
    message: "OTP Verified Successfully",
    accessToken,
    refreshToken: auth.refreshToken,
  };
};

export const resendOtp = async (
  body: SendOtpDto,
): Promise<MessageInterface> => {
  return { message: "OTP resend Successfully" };
};

export const verifyToken = async (body: VerifyTokenDto) => {
  const payload = await jwt.verify(body.token, process.env.AUTH_SECRET!);
  return payload;
};

// export const sendOtp = async (body: any): Promise<MessageInterface> => {
//   const authPayload = {
//     mobile: body.mobile,
//     refreshToken: uuid(),
//     expiredAt: moment().add(1, "M"),
//   };

//   await AuthModel.findOneAndUpdate(
//     { mobile: body.mobile },
//     { $set: authPayload },
//     { upsert: true, new: true },
//   );

//   const { data } = await axios.post(
//     `/otp?otp_expiry=10&template_id=${process.env.OTP_TEMPLATE_ID}&mobile=${body.mobile}&authKey=${process.env.MSG_AUTH_KEY}`,
//   );
//   if (data.type !== "success") {
//     throw new Error("Failed to send Otp");
//   }

//   return { message: "OTP send Succesfully" };
// };

// export const verifyOtp = async (body: any): Promise<MessageInterface> => {
//   const { data } = await axios.post(
//     `/otp/verify?mobile=${body.mobile}&authKey=${process.env.MSG_AUTH_KEY}&otp=${body.otp}`,
//   );

//   if (data.type !== "success") {
//     throw new Error("Failed to verify OTP");
//   }

//   return { message: "OTP Verified Successfully" };
// };

// export const resendOtp = async (body: any): Promise<MessageInterface> => {
//   const { data } = await axios.post(
//     `/otp/retry?mobile=${body.mobile}&authKey=${process.env.MSG_AUTH_KEY}&retryType=text`,
//   );

//   if (data.type !== "success") {
//     throw new Error("Failed to resend OTP");
//   }

//   return { message: "OTP resend Successfully" };
// };

//
