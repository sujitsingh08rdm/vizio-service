import dotenv from "dotenv"
dotenv.config()

import mongoose from "mongoose"
mongoose
	.connect(process.env.DB!)
	.then(() => console.log("notification - DB Running"))
	.catch(() => console.log("notification - DB Failed"))

import express, { Request, Response } from "express"
import NotificationRouter from "./notification.router"
import morgan from "morgan"
import cors from "cors"
const app = express()

app.listen(process.env.PORT, () => {
	console.log("notification service running on - http://localhost:4005/notification")
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: process.env.CLIENT, credentials: true }))

app.use("/notification", NotificationRouter)