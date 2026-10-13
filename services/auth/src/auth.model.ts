import { Schema, model } from "mongoose"
import { AuthModelInterface } from "./auth.interface"

const schema = new Schema<AuthModelInterface>({

	
}, {timestamps: true})

const AuthModel = model<AuthModelInterface>("Auth", schema)
export default AuthModel