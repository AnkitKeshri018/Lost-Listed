import { FoundItem } from "../models/founditem.model.js";
import getDataUri from "../utils/getDataUri.js";
import cloudinary from "../utils/cloudinary.js";
import { sendEmail } from "../utils/sendEmail.js";
import { User } from "../models/user.model.js";



export const createFoundItem = async (req, res) => {
  try {
    const { title, description, category, dateFound, location } = req.body;
    const userId = req.user._id;

    if (!title || !dateFound || !location) {
      return res.status(400).json({
        message: "Title, dateFound, and location are required",
        success: false,
      });
    }

    let imageData = null;
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      imageData = {
        url: cloudResponse.secure_url,
        public_id: cloudResponse.public_id,
      };
    }

    const newItem = await FoundItem.create({
      title,
      description,
      category,
      dateFound,
      location,
      user: userId,
      image: imageData,
    });

    return res.status(201).json({
      message: "Found item created successfully",
      data: newItem,
      success: true,
    });
  } catch (error) {
    console.error("Error creating Found item:", error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};



export const getAllFoundItems = async (req, res) => {
  try {
    // Fetch all found items and populate the user who posted them
    const foundItems = await FoundItem.find()
      .populate("user", "username fullName avatar") // only select necessary user fields
      .sort({ createdAt: -1 }); // latest items first

    return res.status(200).json({
      message: "Found items fetched successfully",
      data: foundItems,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching found items:", error);
    return res.status(500).json({
      message: "Something went wrong while fetching found items",
      success: false,
    });
  }
};



export const getFoundItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const foundItem = await FoundItem.findById(id)
      .populate("user", "username fullName avatar")
      .populate("claimedBy", "username fullName email");

    if (!foundItem) {
      return res.status(404).json({
        message: "found item not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Found item fetched successfully",
      data: foundItem,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching found item:", error);
    return res.status(500).json({
      message: "Something went wrong while fetching the found item",
      success: false,
    });
  }
};



export const getUserFoundItems = async (req, res) => {
  try {
    const userId = req.user._id;
    const items = await FoundItem.find({ user: userId })
      .populate("user", "username fullName avatar")
      .populate("claimedBy", "fullName email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Your found items fetched successfully",
      data: items,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};



export const updateFoundItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, dateFound, location, isReturned } =
      req.body;

    // Build fields to update
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (dateFound) updateData.dateFound = dateFound;
    if (location) updateData.location = location;
    if (typeof isReturned !== "undefined") isReturned.isFound = isReturned;

    // Handle image upload if file exists
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      updateData.image = {
        url: cloudResponse.secure_url,
        public_id: cloudResponse.public_id,
      };
    }

    // Update in DB
    const updatedItem = await FoundItem.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).populate("user", "username fullName avatar");

    if (!updatedItem) {
      return res.status(404).json({
        message: "Found item not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Found item updated successfully",
      data: updatedItem,
      success: true,
    });
  } catch (error) {
    console.error("Error updating found item:", error);
    return res.status(500).json({
      message: "Something went wrong while updating found item",
      success: false,
    });
  }
};


export const markItemClaimed = async (req, res) => {
  try {
    const { id } = req.params;
    const claimerId = req.user._id; // user who marks it claimed


   

    // Fetch the found item and populate the original owner's info
    const item = await FoundItem.findById(id).populate("user", "email username fullName avatar");

    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.user._id.toString() === claimerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot claim item founded by you.",
      });
    }

    if (item.isClaimed) {
      return res.status(400).json({
        message: "Item is already Claimed",
        data: item,
      });
    }

   
    item.isClaimed = true;
    item.claimedBy = claimerId;
    await item.save();

    // Fetch the user who claimed the item
    const claimer = await User.findById(claimerId).select(
      "username fullName email phone"
    );

    // Send email to the founder including claimer info
    const ownerEmail = item.user.email;
    const subject = "Your found item has been claimed!";
    const text = `Hello ${item.user.fullName},

Your found item "${item.title}" has been claimed by someone.

Clamier's information:
- Full Name: ${claimer.fullName}
- Username: ${claimer.username}
- Email: ${claimer.email}
- Phone: ${claimer.phone}

Please contact them to return their item.`;

    await sendEmail({ to: ownerEmail, subject, text });

    return res.status(200).json({
      success:true,
      message: "Item marked as claimed and founder notified with claimer info",
      data: item,
    });
  } catch (error) {
    console.error("Error marking item as claimed:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


export const unmarkItemClaimed = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await FoundItem.findById(id);

    if (!item) return res.status(404).json({ message: "Item not found" });

    if (!item.isClaimed) {
      return res.status(400).json({
        message: "Item is already not claimed",
        data: item,
      });
    }

    item.isClaimed = false;
    await item.save();

    return res.status(200).json({
      message: "Item unclaimed",
      data: item,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


export const deleteFoundItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const item = await FoundItem.findById(id);

    if (!item) {
      return res.status(404).json({
        message: "Found item not found",
        success: false,
      });
    }

    // Only allow the owner to delete
    if (item.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this item",
        success: false,
      });
    }

    await item.deleteOne();

    return res.status(200).json({
      message: "Item deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting found item:", error); // log the real error
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};



export const filterFoundItems = async (req, res) => {
  try {
    const { title, category, location, dateFrom, dateTo, isClaimed } = req.query;

    const query = {};

    // Text-based filters
    if (title) query.title = { $regex: title, $options: "i" };
    if (location) query.location = { $regex: location, $options: "i" };

    // Exact match filter
    if (category) query.category = category;

    // Date range filter
    if (dateFrom || dateTo) {
      query.dateFound = {};
      if (dateFrom) query.dateFound.$gte = new Date(dateFrom);
      if (dateTo) query.dateFound.$lte = new Date(dateTo);
    }

    // Boolean filter
    if (isClaimed !== undefined) query.isClaimed = isClaimed === "true";

    const foundItems = await FoundItem.find(query)
      .populate("user", "username fullName avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Filtered found items fetched successfully",
      data: foundItems,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching filtered found items:", error);
    return res.status(500).json({
      message: "Something went wrong while fetching found items",
      success: false,
    });
  }
};


export const getRecentFoundItems = async (req, res) => {
  try {
    const recentItems = await FoundItem.find()
      .sort({ createdAt: -1 }) // newest first
      .limit(5) // return only 5 items
      .populate("user", "username fullName avatar");

    return res.status(200).json({
      message: "Recent found items fetched successfully",
      data: recentItems,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching recent found items:", error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};