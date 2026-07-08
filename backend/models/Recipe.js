import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    ingredients: {
      type: [String],
      default: [],
    },
    steps: {
      type: [String],
      default: [],
    },
    prepTime: {
      type: String,
      default: "0",
    },
    cookTime: {
      type: String,
      default: "0",
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    cuisine: {
      type: String,
      default: "Other",
    },
    category: {
      type: String,
      default: "Other",
    },
    likes: {
      type: Number,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Text index for search
recipeSchema.index({ title: "text", cuisine: "text", category: "text" });

export default mongoose.model("Recipe", recipeSchema);