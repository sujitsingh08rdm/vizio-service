import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
const app = express();

app.listen(process.env.PORT, () => {
  console.log("gateway service running on - http://localhost:8080");
});

app.use(cors({ origin: process.env.CLIENT, credentials: true }));
app.use(morgan("dev"));


app.use("/one",createProxyMiddleware({
	target: "http://localhost:4001/one",
	changeOrigin: true
}))

app.use("/auth",createProxyMiddleware({
	target: "http://localhost:4002/auth",
	changeOrigin: true
}))

app.use("/bucket",createProxyMiddleware({
	target: "http://localhost:4003/bucket",
	changeOrigin: true
}))

app.use("/video",createProxyMiddleware({
	target: "http://localhost:4004/video",
	changeOrigin: true
}))

app.use("/notification",createProxyMiddleware({
	target: "http://localhost:4005/notification",
	changeOrigin: true
}))