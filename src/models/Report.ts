import mongoose, { Document, model, Schema } from "mongoose";


export interface ReportDocument extends Document {
    type: "inventory" | "order";
    generatedBy: mongoose.Types.ObjectId;
    fileUrl: string;
    createdAt: Date;
  }
  
  const ReportSchema = new Schema<ReportDocument>(
    {
      type: {
        type: String,
        enum: ["inventory", "order"],
        required: true,
      },
      generatedBy: {
        type: Schema.Types.ObjectId,
        ref: "User", 
        required: true,
      },
      fileUrl: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  );
  
  const Report = mongoose.models.Report || model("Report", ReportSchema);
  export default Report;
  