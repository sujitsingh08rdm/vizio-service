import { Document, Types } from "mongoose";
import { VideoStatusEnum } from "./video.enum";
import { Request } from "express";

interface ThumbnailInterface {
  high?: {
    path: string;
    width: number;
    height: number;
  };
  medium?: {
    path: string;
    width: number;
    height: number;
  };
  low?: {
    path: string;
    width: number;
    height: number;
  };
}

export interface VideoModelInterface extends Document {
  user: Types.ObjectId;
  title: string;
  description?: string;
  size: number;
  duration: number;
  path: string;
  status: VideoStatusEnum;
  thumbnail: ThumbnailInterface;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    fullname: string;
    email: string;
    mobile: string;
  };
}

export interface PaginationInterface {
  total: number;
  data: any[];
}
