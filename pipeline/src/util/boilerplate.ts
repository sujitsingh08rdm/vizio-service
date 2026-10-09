export const appBoilerplate = (service: string, port: number) => {
  return [
    `import dotenv from "dotenv"`,
    `dotenv.config()\n`,
    `import mongoose from "mongoose"`,
    `mongoose`,
    `\t.connect(process.env.DB!)`,
    `\t.then(() => console.log("${service} - DB Running"))`,
    `\t.catch(() => console.log("${service} - DB Failed"))\n`,
    `import express, { Request, Response } from "express"`,
    `import morgan from "morgan"`,
    `import cors from "cors"`,
    `const app = express()\n`,
    `app.listen(process.env.PORT, () => {`,
    `\tconsole.log("${service} Service Running on ${port}", process.env.PORT)`,
    `})\n`,
    `app.use(express.json())`,
    `app.use(express.urlencoded({ extended: false }));`,
    `app.use(cors({ origin: process.env.CLIENT, credentials: true }))`,
    `app.use(morgan("dev"))`,
  ];
};

export const routerBoilderplate = (service: string) => {
  return [
    `import { Router, Request, Response } from "express"`,
    `const AuthRouter = Router()\n`,
    `AuthRouter.get("/", (req: Request, res: Response) => {`,
    `\tres.json({message: "Hello From ${service} service"})`,
    `})\n`,
    `export default AuthRouter`,
  ];
};
