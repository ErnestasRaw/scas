import mongoose, { Schema, model } from "mongoose";


export interface ReservationDocument {
  reservationId: string;
  userId: mongoose.Types.ObjectId; 
  venueId: mongoose.Types.ObjectId; 
  reservationDate: Date;
  status: string; 
  guests: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema = new Schema<ReservationDocument>(
  {
    reservationId: {
      type: String,
      required: true,
      unique: true,
      default: () => `res_${Math.random().toString(36).substr(2, 9)}`, 
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue", 
      required: true,
    },
    reservationDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "canceled"], 
      default: "pending",
    },
    guests: {
      type: Number,
      required: true,
      min: 1, 
    },
  },
  {
    timestamps: true, 
  }
);

const Reservation =
  mongoose.models?.Reservation ||
  model<ReservationDocument>("Reservation", ReservationSchema);

export default Reservation;
