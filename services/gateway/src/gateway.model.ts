import { Schema, model } from "mongoose"
import { GatewayModelInterface } from "./gateway.interface"

const schema = new Schema<GatewayModelInterface>({

	
}, {timestamps: true})

const GatewayModel = model<GatewayModelInterface>("Gateway", schema)
export default GatewayModel