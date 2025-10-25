import { User } from "../models/user.model.js";
import getDataUri from "../utils/getDataUri.js";
import cloudinary from "../utils/cloudinary.js";


export const registerUser = async (req, res) => {
  try {
    const { fullName, email, username, password, phone, location } = req.body;

    if ([fullName, email, username, password].some((f) => !f?.trim())) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUser) {
      return res.status(409).json({
        message: "User with email or username already exists",
        success: false,
      });
    }

    // Avatar upload
    const avatarFile = req.file;
    if (!avatarFile) {
      return res.status(400).json({
        message: "Avatar image is required",
        success: false,
      });
    }

    const fileUri = getDataUri(avatarFile);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    const user = await User.create({
      username,
      email,
      fullName,
      phone,
      location,
      avatar: {
        url: cloudResponse.secure_url,
        public_id: cloudResponse.public_id,
      },
      password,
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return res.status(201).json({
      message: "User registered successfully",
      data: createdUser,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong while registering the user",
      success: false,
    });
  }
};

