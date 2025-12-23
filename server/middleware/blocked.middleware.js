import User from "../models/user.model.js";

export const checkBlockedUser = async (req, res, next) => {
  try {
    const { userId } = req.auth();

    const mongoUser = await User.findOne({ clerkId: userId });
    if (!mongoUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (mongoUser.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account is blocked. Please contact support.",
      });
    }

    next();
  } catch (error) {
    console.log("Error in checkBlockedUser middleware:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
