import User from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";

export const registerUser = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { name, email, role, location, mobileNo } = req.body || {};
    let user = await User.findOne({ clerkId: userId });
    if (!name || !email || !role || !location || !mobileNo) {
        return res.status(201).json({
          success: false,
          message: "All field are required",
        });
    }
    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto",
        folder: "issues",
      });
      imageUrl = result.secure_url;
    }
    if (!user) {
      //create new user
      return res.status(400).json({
          success: false,
          message: "User is unauthorized , try to login again",
        });
      
     
    } else {
      // Optional: keep user info in sync      
      user.name = name;
      user.email = email;
      user.role = role;
      user.location = location;
      user.mobileNo = mobileNo;
      user.imageUrl=imageUrl;
      await user.save();
    }
    return res.status(200).json({
      success:true,
      user,
    });
  } catch (error) {
    console.error("User register error:", error);
    return res.status(500).json({ message: "Failed to register user" });
  }
};

export const syncUser = async (req, res) => {
  // console.log("Syncing user arrived");
  
  try {
    const { userId } = req.auth();
    const { email } = req.body;
    // console.log("ClerkId : ", userId);
    // console.log("email : ", email);
    
    let user = await User.findOne({ clerkId: userId });
    if (!user) {
      user=await User.create({
        clerkId: userId,
        email,
      });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("User sync error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to sync user",
    });
  }
};


export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { name, role, location, mobileNo } = req.body;

    // 🔐 Update only provided fields
    if (name) user.name = name;
    if (role) user.role = role;
    if (location) user.location = location;
    if (mobileNo) user.mobileNo = mobileNo;

    // 🖼️ Image handling (SAFE)
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "issues",
        resource_type: "auto",
      });
      user.imageUrl = result.secure_url;
    }
    // ❗ if no req.file → imageUrl stays unchanged

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
