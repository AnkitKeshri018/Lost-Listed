import mongoose, { Schema } from "mongoose";

// 🛍 PRODUCT (MARKETPLACE) SCHEMA
const productSchema = new Schema(
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

    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },

    category: {
      type: String,
      enum: [
        "Electronics",
        "Books",
        "Clothing",
        "Accessories",
        "Home",
        "Vehicles",
        "Other",
      ],
      default: "Other",
    },

    condition: {
      type: String,
      enum: ["new", "used"],
      default: "used",
    },

    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],

    seller: {
      type: Schema.Types.ObjectId,
      ref: "User", // 🔗 connects to the seller
      required: true,
    },

    isSold: {
      type: Boolean,
      default: false,
    },

    location: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// 🧠 MODEL EXPORT
export const Product = mongoose.model("Product", productSchema);
