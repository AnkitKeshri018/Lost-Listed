import mongoose, { Schema } from "mongoose";

const activitySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    item: {
      type: Schema.Types.ObjectId,
      refPath: "itemType", // dynamic reference LostItem / FoundItem / Product
    },

    itemType: {
      type: String,
      enum: ["LostItem", "FoundItem", "Product"],
      required: true,
    },

    activityType: {
      type: String,
      enum: [
        "LOST_REPORTED",
        "FOUND_REPORTED",
        "ITEM_CLAIMED",
        "ITEM_RETURNED",
        "ITEM_FOR_SALE",
      ],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Activity = mongoose.model("Activity", activitySchema);
