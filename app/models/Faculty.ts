import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFaculty extends Document {
  name: string;
  email: string;
  designation: string;
  specialization: string;
  experience: string;
  education: string;
  bio: string;
  image: string;
  achievements: string[];
  createdAt: Date;
  updatedAt: Date;
}

const FacultySchema: Schema<IFaculty> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Faculty name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    designation: {
      type: String,
      required: [true, "Designation is required"],
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
    },
    experience: {
      type: String,
      default: "0 Years",
    },
    education: {
      type: String,
      required: [true, "Education/Qualification is required"],
    },
    bio: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "", // You might want a default placeholder URL here
    },
    achievements: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Faculty: Model<IFaculty> =
  mongoose.models.Faculty || mongoose.model<IFaculty>("Faculty", FacultySchema);

export default Faculty;