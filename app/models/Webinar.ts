import { Schema, model, models } from "mongoose";

const WebinarSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    webinarLink: { type: String, default: "" },
    recordedLink: { type: String, default: "" },
    dateTime: { type: Date, required: true },
    mentors: [{ type: String }],
    
     
    certificateTemplate: { 
      type: String, 
      default: ""  
    },
    certificateLayout: {
      name: { 
        x: { type: Number, default: 300 }, 
        y: { type: Number, default: 300 },
        size: { type: Number, default: 24 },
        color: { type: String, default: "#000000" } 
      },
      date: { 
        x: { type: Number, default: 300 }, 
        y: { type: Number, default: 200 },
        size: { type: Number, default: 14 },
        color: { type: String, default: "#000000" } 
      },
      qr: { 
        x: { type: Number, default: 300 }, 
        y: { type: Number, default: 200 },
        size: { type: Number, default: 14 },
        color: { type: String, default: "#000000" } 
      }
    },
     

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