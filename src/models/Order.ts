import mongoose, { Document, model, Schema } from "mongoose";


export interface OrderDocument extends Document {
    item: mongoose.Types.ObjectId;
    quantity: number;
    status: "pending" | "completed" | "canceled";
    supplier: mongoose.Types.ObjectId;
    orderedBy: mongoose.Types.ObjectId; 
    createdAt: Date;
    updatedAt: Date;
  }
  
  const OrderSchema = new Schema<OrderDocument>(
    {
      item: {
        type: Schema.Types.ObjectId,
        ref: "Inventory",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "completed", "canceled"],
        default: "pending",
      },
      supplier: {
        type: Schema.Types.ObjectId,
        ref: "Supplier",
        required: true,
      },
      orderedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
    { timestamps: true }
  );
  
  const Order = mongoose.models.Order || model("Order", OrderSchema);
  export default Order;
  