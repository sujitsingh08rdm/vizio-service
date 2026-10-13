import { Schema, model } from "mongoose"
import { NotificationModelInterface } from "./notification.interface"

const schema = new Schema<NotificationModelInterface>({

	
}, {timestamps: true})

const NotificationModel = model<NotificationModelInterface>("Notification", schema)
export default NotificationModel