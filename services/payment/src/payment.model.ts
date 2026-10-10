import { Schema, model } from "mongoose"
import { PaymentModelInterface } from "./payment.interface"

const schema = new Schema<PaymentModelInterface>({

	
}, {timestamps: true})

const PaymentModel = model<PaymentModelInterface>("Payment", schema)
export default PaymentModel