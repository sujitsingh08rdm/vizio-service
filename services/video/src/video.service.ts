import VideoModel from "./video.model";
import { PaginationInterface, VideoModelInterface } from "./video.interface";
import { CreateVideoDto } from "./video.dto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";
import Redis from "ioredis";
import { webhookQueue } from "./video.queue";

const FIFTEEN_MINUTES = 900;

const s3 = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

const generateSignedUrlForUpload = async (
  path: string,
  userId: string,
  videoId: string,
) => {
  const cmd = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: path,
    Metadata: {
      user_id: userId,
      video_id: videoId,
    },
  });
  const url = await getSignedUrl(s3, cmd, { expiresIn: FIFTEEN_MINUTES });
  return url;
};

export const createVideo = async (
  userId: string,
  body: CreateVideoDto,
): Promise<{ uploadUrl: string; video: VideoModelInterface }> => {
  const filename = nanoid(8)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "");
  const path = `originals/${userId}/${filename}.mp4`;
  body.user = userId;
  body.path = path;

  const video = await VideoModel.create(body);
  const uploadUrl = await generateSignedUrlForUpload(
    path,
    userId,
    video._id.toString(),
  );

  return { uploadUrl, video };
};

export const fetchVideos = async (
  userId: string,
  page: number,
  limit: number,
): Promise<PaginationInterface> => {
  const skip = (page - 1) * limit;
  const [total, videos] = await Promise.all([
    VideoModel.countDocuments(),
    VideoModel.find({ user: userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
  ]);

  return { total, data: videos };
};

const getVideoStatus = (status: string) => {
  if (status === "PROGRESSING") {
    return "converting";
  }
  if (status === "CANCELED" || status === "ERROR") {
    return "failed";
  }
  if (status === "COMPLETE") {
    return "published";
  }
};

export const videoTranscodingWebhook = async (body: any) => {
  const videoId = body.userMetadata.video_id;
  const status = getVideoStatus(body.status);

  const options = {
    removeOnComplete: true,
    removeOnFailed: true,
    removeOnFail: true,
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  };

  await webhookQueue.add("update-status", { videoId, status }, options);

  return { message: "video status added to queue" };
};

export const updateVideoStatus = async (videoId: string, status: string) => {
  await VideoModel.updateOne({ _id: videoId }, { status });
  return { message: "video status updated" };
};
