
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT =async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken; // we are using httpOnly cookie

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authenticated", success: false });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded._id);

    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found", success: false });
    }

    req.user = user; // attach user to request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token", success: false });
  }
};

