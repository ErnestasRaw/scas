import { timeStamp } from "console";
import mongoose, { Schema, model } from "mongoose";


export interface ReservationDocument {
  _id: string;
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
      required: false,
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
