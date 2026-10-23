import fs from "fs";
import VideoModel from "./video.model";
import { PaginationInterface, VideoModelInterface } from "./video.interface";
import { CreateVideoDto } from "./video.dto";
import { Types } from "mongoose";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";

const FIFTEEN_MINUTES = 900;

const s3 = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

const generateSignedUrlForUpload = async (path: string) => {
  const cmd = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: path,
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
  body.path = path;

  const [uploadUrl, video] = await Promise.all([
    generateSignedUrlForUpload(path),
    VideoModel.create({
      ...body,
      user: new Types.ObjectId(userId),
    }),
  ]);

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

export const videoTranscodingWebhook = (body: any) => {
  console.log("REquest recieved from Lambda");
  fs.writeFileSync("video.json", JSON.stringify(body, null, 2));
  return { message: "Success" };
};
