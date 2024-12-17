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
      required: [true, "El. pašto adresas yra privalomas"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "El. pašto adresas turi būti tinkamo formato",
      ],
    },
    phone: {
      type: String,
      required: [true, "Telefono numeris yra privalomas"],
      match: [
        /^\+?[1-9]\d{1,14}$/,
        "Telefono numeris turi būti tinkamo formato, pvz. +37061396772",
      ],
      maxlength: [13, "Telefono numeris turi būti ne ilgesnis nei 15 simbolių"],
    },
    role: {
      type: String,
      enum: Object.values(userRoles),
      default: userRoles.USER,
    },
    password: {
      type: String,
      required: [true, "Slaptažodis yra privalomas"],
      minlength: [8, "Slaptažodis turi būti bent 8 simbolių ilgio"],
      match: [
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Slaptažodis turi būti bent 8 simbolių ilgio, turėti bent vieną mažąją raidę, didžiąją raidę, skaičių ir specialų simbolį [@$!%*?&]",
      ],
    },
    name: {
      type: String,
      required: [true, "Vardas yra privalomas"],
      maxlength: [100, "Vardas negali būti ilgesnis nei 100 simbolių"],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models?.User || model<UserDocument>("User", UserSchema);
export default User;
