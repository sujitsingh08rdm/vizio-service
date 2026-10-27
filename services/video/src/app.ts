import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
mongoose
  .connect(process.env.DB!)
  .then(() => console.log("video - DB Running"))
  .catch(() => console.log("video - DB Failed"));

import "./video.worker";
import express from "express";

import VideoRouter from "./video.router";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.listen(process.env.PORT, () => {
  console.log("video service running on - http://localhost:4004/video");
});

app.use(express.json());
app.use(express.json({ type: ["application/json", "text/plain"] }));
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: process.env.CLIENT, credentials: true }));
app.use(cookieParser());

app.use("/video", VideoRouter);
