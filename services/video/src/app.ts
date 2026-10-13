import dotenv from "dotenv"
dotenv.config()

import mongoose from "mongoose"
mongoose
	.connect(process.env.DB!)
	.then(() => console.log("video - DB Running"))
	.catch(() => console.log("video - DB Failed"))

import express, { Request, Response } from "express"
import VideoRouter from "./video.router"
import morgan from "morgan"
import cors from "cors"
const app = express()

app.listen(process.env.PORT, () => {
	console.log("video service running on - http://localhost:4004/video")
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: process.env.CLIENT, credentials: true }))

app.use("/video", VideoRouter)