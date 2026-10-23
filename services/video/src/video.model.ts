import mongoose, { Schema, model } from "mongoose";
import { VideoModelInterface } from "./video.interface";
import { VideoStatusEnum } from "./video.enum";

const schema = new Schema<VideoModelInterface>(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    size: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: VideoStatusEnum,
      default: VideoStatusEnum.draft,
    },
  },
  { timestamps: true },
);

const VideoModel = model<VideoModelInterface>("Video", schema);
export default VideoModel;
