import dotenv from "dotenv"
dotenv.config()

import mongoose from "mongoose"
mongoose
	.connect(process.env.DB!)
	.then(() => console.log("bucket - DB Running"))
	.catch(() => console.log("bucket - DB Failed"))

import express, { Request, Response } from "express"
import BucketRouter from "./bucket.router"
import morgan from "morgan"
import cors from "cors"
const app = express()

app.listen(process.env.PORT, () => {
	console.log("bucket service running on - http://localhost:4002/bucket")
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: process.env.CLIENT, credentials: true }))
app.use(morgan("dev"))

app.use("/bucket", BucketRouter)