import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import axios from "axios";
import { AuthRequest } from "./video.interface";
axios.defaults.baseURL = process.env.SERVER;

export const WebhookGuardMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const lambdaSignature = req.headers["x-api-signature"];
    const payload = JSON.stringify(req.body);

    const signature = crypto
      .createHmac("sha256", process.env.WEBHOOK_SECRET!)
      .update(payload)
      .digest("hex");

    if (lambdaSignature !== signature) {
      throw new Error("unauthorized");
    }
    next();
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    res.status(401).json({ message: "unauthorized" });
  }
};

export const DtoMiddleware =
  (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res
        .status(400)
        .json({ message: "Validation Failed", error: result.error.format() });
      return;
    }
    req.body = result.data;
    next();
  };

export const AuthMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      throw new Error("Unauthorized");
    }

    const options = { headers: { "x-api-key": process.env.API_KEY } };
    const { data } = await axios.post(
      "/auth/verify-token",
      { token: token },
      options,
    );
    req.user = {
      id: data.id,
      mobile: data.mobile,
      email: data.email,
      fullname: data.fullname,
    };
    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ message: error.message });
    }
  }
};
