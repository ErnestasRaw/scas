import mongoose, { Schema, model } from "mongoose";

export interface EventDocument {    
    name: string;
    date: Date;
    location: mongoose.Types.ObjectId;
    description: string;
}

const EventSchema = new Schema<EventDocument>(
    {
        name: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        location: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Location",
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Event =
  mongoose.models?.Event ||
  model<EventDocument>("Event", EventSchema);


export default Event;