import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 20,
      lowercase: true,
    },
    age: {
      type: Number,
      min: 18,
      max: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
    active: {
      type: Boolean,
      default: true,
    },
    services: [{ type: Schema.Types.ObjectId, ref: "Service" }],
    passwordHash: { type: String, required: true },
    profilePic: { type: String },
    confirmEmail: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const UserModel = model("User", userSchema);

export default UserModel;
