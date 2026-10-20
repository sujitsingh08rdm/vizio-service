import { NextFunction, Request, Response } from "express";

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

export const IscMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      throw new Error("Un-authorized");
    }

    if (apiKey !== process.env.API_KEY) {
      throw new Error("Un-authorized");
    }

    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ message: "Un-authorized" });
    }
  }
};
