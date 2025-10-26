import { LostItem } from "../models/lostitem.model.js";
import getDataUri from "../utils/getDataUri.js";
import cloudinary from "../utils/cloudinary.js";
import { sendEmail } from "../utils/sendEmail.js";
import { User } from "../models/user.model.js";

export const createLostItem = async (req, res) => {
  try {
    const { title, description, category, dateLost, location } = req.body;
    const userId = req.user._id;

    if (!title || !dateLost || !location) {
      return res.status(400).json({
        message: "Title, dateLost, and location are required",
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

    const newItem = await LostItem.create({
      title,
      description,
      category,
      dateLost,
      location,
      user: userId,
      image: imageData,
    });

    return res.status(201).json({
      message: "Lost item created successfully",
      data: newItem,
      success: true,
    });
  } catch (error) {
    console.error("Error creating lost item:", error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};


export const getAllLostItems = async (req, res) => {
  try {
    // Fetch all lost items and populate the user who posted them
    const lostItems = await LostItem.find()
      .populate("user", "username fullName avatar") // only select necessary user fields
      .sort({ createdAt: -1 }); // latest items first

    return res.status(200).json({
      message: "Lost items fetched successfully",
      data: lostItems,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching lost items:", error);
    return res.status(500).json({
      message: "Something went wrong while fetching lost items",
      success: false,
    });
  }
};


export const getLostItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const lostItem = await LostItem.findById(id)
      .populate("user", "username fullName avatar")
      .populate("foundBy", "username fullName email");

    if (!lostItem) {
      return res.status(404).json({
        message: "Lost item not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Lost item fetched successfully",
      data: lostItem,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching lost item:", error);
    return res.status(500).json({
      message: "Something went wrong while fetching the lost item",
      success: false,
    });
  }
};


export const getUserLostItems = async (req, res) => {
  try {
    const userId = req.user._id;
    const items = await LostItem.find({ user: userId })
      .populate("user", "username fullName avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Your lost items fetched successfully",
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



export const updateLostItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, dateLost, location, isFound } =
      req.body;

    // Build fields to update
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (dateLost) updateData.dateLost = dateLost;
    if (location) updateData.location = location;
    if (typeof isFound !== "undefined") updateData.isFound = isFound;

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
    const updatedItem = await LostItem.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).populate("user", "username fullName avatar");

    if (!updatedItem) {
      return res.status(404).json({
        message: "Lost item not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Lost item updated successfully",
      data: updatedItem,
      success: true,
    });
  } catch (error) {
    console.error("Error updating lost item:", error);
    return res.status(500).json({
      message: "Something went wrong while updating lost item",
      success: false,
    });
  }
};




export const markItemFound = async (req, res) => {
  try {
    const { id } = req.params;
    const finderId = req.user._id; // user who marks it found

    // Fetch the lost item and populate the original owner's info
    const item = await LostItem.findById(id).populate("user", "email fullName");

    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.isFound) {
      return res.status(400).json({
        message: "Item is already marked as found",
        data: item,
      });
    }

    // Mark as found and save who found it
    item.isFound = true;
    item.foundBy = finderId;
    await item.save();

    // Fetch the user who found the item
    const finder = await User.findById(finderId).select(
      "username fullName email phone"
    );

    // Send email to the original owner including finder info
    const ownerEmail = item.user.email;
    const subject = "Your lost item has been found!";
    const text = `Hello ${item.user.fullName},

Your lost item "${item.title}" has been found by someone.

Finder's information:
- Full Name: ${finder.fullName}
- Username: ${finder.username}
- Email: ${finder.email}
- Phone: ${finder.phone}

Please contact them to retrieve your item.`;

    await sendEmail({ to: ownerEmail, subject, text });

    return res.status(200).json({
      message: "Item marked as found and owner notified with finder info",
      data: item,
    });
  } catch (error) {
    console.error("Error marking item as found:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};



export const unmarkItemFound = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await LostItem.findById(id);

    if (!item) return res.status(404).json({ message: "Item not found" });

    if (!item.isFound) {
      return res.status(400).json({
        message: "Item is already unmarked as found",
        data: item,
      });
    }

    item.isFound = false;
    await item.save();

    return res.status(200).json({
      message: "Item unmarked as found",
      data: item,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteLostItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const item = await LostItem.findById(id);

    if (!item) {
      return res.status(404).json({
        message: "Lost item not found",
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
    console.error("Error deleting lost item:", error); // log the real error
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};



export const filterLostItems = async (req, res) => {
  try {
    const { title, category, location, dateFrom, dateTo, isFound } = req.query;

    const query = {};

    // Text-based filters
    if (title) query.title = { $regex: title, $options: "i" };
    if (location) query.location = { $regex: location, $options: "i" };

    // Exact match filter
    if (category) query.category = category;

    // Date range filter
    if (dateFrom || dateTo) {
      query.dateLost = {};
      if (dateFrom) query.dateLost.$gte = new Date(dateFrom);
      if (dateTo) query.dateLost.$lte = new Date(dateTo);
    }

    // Boolean filter
    if (isFound !== undefined) query.isFound = isFound === "true";

    const lostItems = await LostItem.find(query)
      .populate("user", "username fullName avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Filtered lost items fetched successfully",
      data: lostItems,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching filtered lost items:", error);
    return res.status(500).json({
      message: "Something went wrong while fetching lost items",
      success: false,
    });
  }
};

export const getRecentLostItems = async (req, res) => {
  try {
    const recentItems = await LostItem.find()
      .sort({ createdAt: -1 }) // newest first
      .limit(5) // return only 5 items
      .populate("user", "username fullName avatar");

    return res.status(200).json({
      message: "Recent lost items fetched successfully",
      data: recentItems,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching recent lost items:", error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

