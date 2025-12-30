import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

// prevent duplicate category per user
CategorySchema.index({ name: 1, user: 1 }, { unique: true });

export default mongoose.model("Category", CategorySchema);
