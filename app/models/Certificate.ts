import { Schema, model, models } from "mongoose";

const CertificateSchema = new Schema(
  {
    // Unique ID for verification (e.g., "GAE-2025-X92Z")
    certificateId: { 
      type: String, 
      required: true, 
      unique: true,
      index: true 
    },

    // Link to the User
    userId: { 
      type: String, 
      required: true,
      index: true
    },
    userEmail: { type: String }, // Optional backup
    userName: { type: String, required: true }, // Store name *as it appeared* at time of issue

    // Link to the Webinar
    webinarId: { 
      type: Schema.Types.ObjectId, 
      ref: "Webinar", 
      required: true 
    },
    webinarTitle: { type: String, required: true },

    // Metadata
    issueDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default models.Certificate || model("Certificate", CertificateSchema);