import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import morgan from "morgan";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import { CORS_CONFIG } from "./gateway.constant";
import Redis from "ioredis";

const subscriber = new Redis();

const app = express();
const server = createServer(app);

server.listen(process.env.PORT, () => {
  console.log("gateway service running on - http://localhost:8080");
});

app.use(cors(CORS_CONFIG));
app.use(morgan("dev"));

app.use(
  "/one",
  createProxyMiddleware({
    target: "http://localhost:4001/one",
    changeOrigin: true,
  }),
);

app.use(
  "/auth",
  createProxyMiddleware({
    target: "http://localhost:4002/auth",
    changeOrigin: true,
  }),
);

app.use(
  "/bucket",
  createProxyMiddleware({
    target: "http://localhost:4003/bucket",
    changeOrigin: true,
  }),
);

app.use(
  "/video",
  createProxyMiddleware({
    target: "http://localhost:4004/video",
    changeOrigin: true,
  }),
);

app.use(
  "/notification",
  createProxyMiddleware({
    target: "http://localhost:4005/notification",
    changeOrigin: true,
  }),
);

const io = new Server(server, { cors: CORS_CONFIG });

io.on("connection", (socket) => {
  console.log("User Connected");
});

subscriber.subscribe("video-transcoding", (err) => {
  if (err) {
    console.log("Failed to subscribe video-transcoding channel");
    return;
  }
  console.log("Video transcoding channel subscribed!");
});

subscriber.on("message", (channel, message) => {
  io.emit("video-transcoding", message);
});
