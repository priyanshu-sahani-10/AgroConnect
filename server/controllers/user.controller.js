import User from "../models/user.model.js";

export const registerUser = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { name, email, role, location, mobileNo } = req.body || {};
    let user = await User.findOne({ clerkId: userId });
    if (!user) {
      //create new user
      if (!name || !email || !role || !location || !mobileNo) {
        res.status(201).json({
          success: false,
          message: "All field are required",
        });
      }
      user = await User.create({
        clerkId: userId,
        name,
        email,
        location,
        role: role || "buyer",
        mobileNo,
      });
    } else {
      // Optional: keep user info in sync      
      user.name = name;
      user.email = email;
      user.role = role;
      user.location = location;
      user.mobileNo = mobileNo;

      await user.save();
    }
    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("User register error:", error);
    return res.status(500).json({ message: "Failed to register user" });
  }
};

export const syncUser = async (req, res) => {
  console.log("Syncing user arrived");
  
  try {
    const { userId } = req.auth();
    const { email } = req.body;
    console.log("ClerkId : ", userId);
    console.log("email : ", email);
    
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
