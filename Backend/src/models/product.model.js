import mongoose, { Schema } from "mongoose";


const productSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      maxlength: [100, "Title can't exceed 100 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description can't exceed 500 characters"],
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
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
      enum: ["new", "used", "like new", "for parts"],
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
      ref: "User",
      required: true,
    },

    isSold: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
