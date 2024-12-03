import mongoose, { Schema, model, Document } from "mongoose";


export interface SupplierDocument extends Document {
    name: string;
    contactInfo: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  const SupplierSchema = new Schema<SupplierDocument>(
    {
      name: {
        type: String,
        required: true,
      },
      contactInfo: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  );
  
  const Supplier = mongoose.models.Supplier || model("Supplier", SupplierSchema);
  export default Supplier;
  