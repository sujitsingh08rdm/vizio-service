import { Router, Response } from "express";
import {
  createThumbnail,
  createVideo,
  fetchVideos,
  getVideoStreamingUrl,
  thumbnailWebhook,
  videoTranscodingWebhook,
} from "./video.controller";
import {
  AuthMiddleware,
  DtoMiddleware,
  WebhookGuardMiddleware,
} from "./video.middleware";
import { createVideoDtoSchema } from "./video.dto";
const VideoRouter = Router();

VideoRouter.post(
  "/",
  AuthMiddleware,
  DtoMiddleware(createVideoDtoSchema),
  createVideo,
);

VideoRouter.post(
  "/thumbnail",
  AuthMiddleware, 
  createThumbnail,
);

VideoRouter.get("/", AuthMiddleware, fetchVideos);
VideoRouter.post("/stream", getVideoStreamingUrl);

VideoRouter.post(
  "/webhook/transcoding",
  WebhookGuardMiddleware,
  videoTranscodingWebhook,
);
VideoRouter.post(
  "/webhook/thumbnail",
  thumbnailWebhook,
);

export default VideoRouter;
