import mongoose from "mongoose";

const chatModel = new mongoose.Schema(
  {
    place: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model("Chat", chatModel);
