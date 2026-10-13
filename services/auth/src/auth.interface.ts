import { Document } from "mongoose";

export interface AuthModelInterface extends Document {
  mobile: string;
  refreshToken: string;
  expiredAt: Date;
}

export interface MessageInterface {
  message: string;
}

export interface VerifyOTPInterface extends MessageInterface {
  accessToken: string;
  refreshToken: string;
}
