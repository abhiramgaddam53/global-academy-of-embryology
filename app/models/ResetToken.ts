// app/models/ResetToken.ts
import mongoose, { Schema } from "mongoose";

const ResetTokenSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tokenHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export default mongoose.models.ResetToken ||
  mongoose.model("ResetToken", ResetTokenSchema);
