import { Schema, model } from "mongoose"
import { VideoModelInterface } from "./video.interface"

const schema = new Schema<VideoModelInterface>({

	
}, {timestamps: true})

const VideoModel = model<VideoModelInterface>("Video", schema)
export default VideoModel