import { Schema, model, models } from "mongoose";

const WebinarSchema = new Schema(
  {
    title: { type: String, required: true },

    description: { type: String, default: "" },

    imageUrl: { type: String, default: "" },

    /**
     * Live webinar link
     * - Visible only during live session
     * - Only for registered users (controlled in API)
     */
    webinarLink: {
      type: String,
      default: "",
    },

    /**
     * Recording link
     * - EMPTY when webinar is created
     * - Updated by admin after session
     * - Publicly visible once available
     */
    recordedLink: {
      type: String,
      default: "",
    },

    dateTime: { type: Date, required: true },

    mentors: [{ type: String }],

    /**
     * Registrations
     * - userId for auth
     * - email for sending confirmations / certificates
     */
    registrations: [
      {
        userId: { type: String, required: true },
        email: { type: String, required: true },
        registeredAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
    strict: true,
  }
);

export default models.Webinar || model("Webinar", WebinarSchema);
