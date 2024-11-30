import mongoose, { Schema, model } from "mongoose";

export interface VenueDocument {
  _id: string; 
  name: string; 
  description?: string; 
  capacity: number; 
  createdAt: Date;
  updatedAt: Date; 
  contactPhone?: string; 
  status: "active" | "inactive";
}
const VenueSchema = new Schema<VenueDocument>(
  {
    name: {
      type: String,
      required: [true, "Pavadinimas yra privalomas"],
      unique: true, 
      trim: true, 
    },
    description: {
      type: String,
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, "Talpa reikalinga"],
      min: [1, "Talpa turi būti didesnė nei 0"],
    },
    contactPhone: {
      type: String,
      match: [
        /^\+?\d{10,15}$/,
        "Netinkamas formatas",
      ],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true, 
  }
);

const Venue = mongoose.models?.Venue || model<VenueDocument>("Venue", VenueSchema);
export default Venue;
