
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export const verifyJWT =async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        message:"Unauthorised request",
        success:false
      })
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      
      return res.status(401).json({
        message: "Invalid Access token",
        success: false,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};

