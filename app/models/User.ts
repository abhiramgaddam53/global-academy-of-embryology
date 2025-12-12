// models/User.ts
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  dob: string;
  qualification: string;
  designation: string;
  clinicName: string;
  address: string;
  workExp: string;
  mobile: string;
  email: string;
  password: string;
  role?: string;
  createdAt: Date;

  passwordResetToken?: string;
  passwordResetExpires?: Date;

  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  dob: { type: String, required: true },
  qualification: { type: String, required: true },
  designation: { type: String, required: true },
  clinicName: { type: String, required: true },
  address: { type: String, required: true },
  workExp: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
   
  createdAt: { type: Date, default: Date.now },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  role: { 
    type: String, 
    enum: ["user", "admin"], 
    default: "user" 
  }
});

// IMPORTANT: async hook must NOT use next
UserSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password")) return;

  const rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10);
  const salt = await bcrypt.genSalt(rounds);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
