import mongoose, { Schema, model } from "mongoose";

export const venueTypes = {
  Conference: "conference",
  Sport: "sport",
  Event: "event",
} as const;

export interface VenueDocument {
  _id: string;
  name: string;
  location: string;
  description?: string;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
  contactPhone?: string;
  status: "active" | "inactive";
  venueType: venueTypes;
}

const VenueSchema = new Schema<VenueDocument>(
  {
    location: {
      type: String,
      required: [true, "Vieta yra privaloma"],
    },
    venueType: {
      type: String,
      enum: Object.values(venueTypes),
      default: venueTypes.Conference,
    },
    name: {
      type: String,
      required: [true, "Pavadinimas yra privalomas"],
      unique: true,
      trim: true,
      maxlength: [100, "Pavadinimas negali būti ilgesnis nei 100 simbolių"],
      minlength : [5, "Pavadinimas turi būti ilgesnis nei 5 simboliai"]
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
      match: [/^\+?\d{10,15}$/, "Netinkamas formatas"],
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
