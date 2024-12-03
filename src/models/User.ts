import mongoose, { Schema, model } from "mongoose";

enum userRoles {
  ADMIN = "admin",
  USER = "user",
  EMPLOYEE = "employee",
  FEDERATION = "federation",
}

export interface UserDocument {
  _id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  role: userRoles;
  orderHistory: mongoose.Types.ObjectId[];
}

const UserSchema = new Schema<UserDocument>(
  {
    orderHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email is invalid",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
    },
    role: {
      type: String,
      enum: Object.values(userRoles),
      default: userRoles.USER,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
  },
  {
    timestamps: true,
  },
  
);

const User = mongoose.models?.User || model<UserDocument>("User", UserSchema);
export default User;