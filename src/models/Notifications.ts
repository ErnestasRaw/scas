import mongoose, { Document, model, Schema } from "mongoose";

export interface NotificationDocument extends Document {
    message: string;
    type: "info" | "warning" | "alert";
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  const NotificationSchema = new Schema<NotificationDocument>(
    {
      message: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ["info", "warning", "alert"],
        required: true,
      },
      isRead: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  );
  
  const Notification = mongoose.models.Notification || model("Notification", NotificationSchema);
  export default Notification;
  