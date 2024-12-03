import mongoose, { Schema, model, Document } from "mongoose";

export interface InventoryDocument extends Document {
  name: string;
  quantity: number;
  condition: "good" | "bad" | "repair";
  location: string;
  supplier: mongoose.Types.ObjectId; 
  createdAt: Date;
  updatedAt: Date;
}

const InventorySchema = new Schema<InventoryDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    condition: {
      type: String,
      enum: ["good", "bad", "repair"],
      required: true,
      default: "good",
    },
    location: {
      type: String,
      required: true,
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
  },
  { timestamps: true }
);

const Inventory = mongoose.models.Inventory || model("Inventory", InventorySchema);
export default Inventory;
