import dotenv from "dotenv"
dotenv.config()

import mongoose from "mongoose"
mongoose
	.connect(process.env.DB!)
	.then(() => console.log("payment - DB Running"))
	.catch(() => console.log("payment - DB Failed"))

import express, { Request, Response } from "express"
import PaymentRouter from "./payment.router"
import morgan from "morgan"
import cors from "cors"
const app = express()

app.listen(process.env.PORT, () => {
	console.log("payment service running on - http://localhost:4003/payment")
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: process.env.CLIENT, credentials: true }))
app.use(morgan("dev"))

app.use("/payment", PaymentRouter)