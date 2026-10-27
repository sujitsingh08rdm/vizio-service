import fs from "fs";
import VideoModel from "./video.model";
import { PaginationInterface, VideoModelInterface } from "./video.interface";
import { CreateVideoDto } from "./video.dto";
import {
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getSignedUrl as cloudSigner } from "@aws-sdk/cloudfront-signer";
import { nanoid } from "nanoid";
import Redis from "ioredis";
import path from "path";
import moment from "moment";
import { webhookQueue } from "./video.queue";
const publisher = new Redis();

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
  acl: ObjectCannedACL = "private",
) => {
  const cmd = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: path,
    Metadata: {
      user_id: userId,
      video_id: videoId,
    },
    ACL: acl,
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
  const streamPath = `streams/${userId}/${filename}/${filename}.m3u8`;
  body.user = userId;
  body.path = streamPath;

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

export const thumbnailWebhook = async (body: any) => {
  console.log("Thubnail webhook Reached");
  const videoId = body.video_id;
  // const userId = body.user_id;
  const sizes = body.sizes;

  const payload = {
    thumbnail: sizes,
  };
  await VideoModel.findByIdAndUpdate(videoId, payload);
  return { message: "Thumbnail updated" };
};

export const updateVideoStatus = async (videoId: string, status: string) => {
  await VideoModel.updateOne({ _id: videoId }, { status });
  return { message: "video status updated" };
};

export const generateCloudfrontSignedUrl = (streamPath: string) => {
  const root = process.cwd();
  const privateFilePath = path.join(root, "private.pem");
  const key = fs.readFileSync(privateFilePath, "utf-8");
  const url = cloudSigner({
    url: `${process.env.CDN}/${streamPath}`,
    keyPairId: process.env.CDN_ID as string,
    dateLessThan: moment().add(60, "minutes").toISOString(),
    privateKey: key,
  });
  return url;
};

export const getVideoStreamingUrl = (body: any) => {
  const url = generateCloudfrontSignedUrl(body.path);
  return { url };
};

export const createThumbnail = async (
  userId: string,
  body: any,
): Promise<{ uploadUrl: string }> => {
  const filename = nanoid(8)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "");
  const path = `thumbnails/${userId}/${filename}.png`;

  const uploadUrl = await generateSignedUrlForUpload(
    path,
    userId,
    body.videoId,
    "public-read",
  );
  const payload = {
    thumbnail: {
      high: { path, width: 1280, height: 720 },
    },
  };
  await VideoModel.findByIdAndUpdate(body.videoId, payload);
  return { uploadUrl };
};
