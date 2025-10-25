import mongoose, { Schema } from "mongoose";


const foundItemSchema = new Schema(
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
      enum: [
        "Electronics",
        "Documents",
        "Clothing",
        "Accessories",
        "Pets",
        "Other",
      ],
      default: "Other",
    },

    dateFound: {
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
      ref: "User", // 🔗 connects to the person who found the item
      required: true,
    },

    isReturned: {
      type: Boolean,
      default: false, // ✅ becomes true once the item is given back
    },
  },
  { timestamps: true }
);

// 🧠 MODEL EXPORT
export const FoundItem = mongoose.model("FoundItem", foundItemSchema);
