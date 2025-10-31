import mongoose, { Schema } from "mongoose";


const lostItemSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      trim: true,
      enum: ["Electronics", "Documents", "Clothing", "Accessories", "Other"],
      default: "Other",
    },

    dateLost: {
      type: Date,
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      url: { type: String },
      public_id: { type: String },
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // 🔗 links to the User model
      required: true,
    },

    isFound: {
      type: Boolean,
      default: false,
    },
    foundBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

// 🧠 MODEL EXPORT
export const LostItem = mongoose.model("LostItem", lostItemSchema);

