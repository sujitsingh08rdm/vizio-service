import { Request, Response } from "express";
import * as videoService from "./video.service";
import { AuthRequest } from "./video.interface";

export const createVideo = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return;
    }
    const video = await videoService.createVideo(userId, req.body);
    res.json(video);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const fetchVideos = async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const userId = req.user?.id;
    if (!userId) {
      return;
    }
    const video = await videoService.fetchVideos(userId, page, limit);
    res.json(video);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const videoTranscodingWebhook = async (req: Request, res: Response) => {
  try {
    console.log("WEBHOOK HIT:", JSON.stringify(req.body));
    const video = await videoService.videoTranscodingWebhook(req.body);
    res.json(video);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const thumbnailWebhook = async (req: Request, res: Response) => {
  try {
    const video = await videoService.thumbnailWebhook(req.body);
    res.json(video);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const getVideoStreamingUrl = async (req: Request, res: Response) => {
  try {
    const stream = await videoService.getVideoStreamingUrl(req.body);
    res.json(stream);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const createThumbnail = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return;
    }
    const thumbnail = await videoService.createThumbnail(userId, req.body);
    res.json(thumbnail);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};
