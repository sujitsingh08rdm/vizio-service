import { Schema, model } from "mongoose"
import { BucketModelInterface } from "./bucket.interface"

const schema = new Schema<BucketModelInterface>({

	
}, {timestamps: true})

const BucketModel = model<BucketModelInterface>("Bucket", schema)
export default BucketModel