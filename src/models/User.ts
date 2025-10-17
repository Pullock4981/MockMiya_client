import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // শুধুমাত্র normal ইউজারের জন্য
  googleId?: string; // Google OAuth ID
  role: "user" | "admin";
  membershipType?: "bronze" | "gold" | "platinum" | "";
  otp?: string;
  otpExpires?: Date;
  isVerified: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // optional, Google ইউজারের জন্য বাদ
    googleId: { type: String }, 
    role: { type: String, enum: ["user", "admin"], default: "user" },
    membershipType: { type: String, enum: ["", "bronze", "gold", "platinum"], default: "" },
    otp: { type: String },
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
