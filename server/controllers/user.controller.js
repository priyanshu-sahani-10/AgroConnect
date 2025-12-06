import User from "../models/user.model.js";

const registerUser = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { name, email, role, location } = req.body || {};
    let user = User.findOne({ clerkId: userId });
    if (!user) {
      //create new user
      user = await User.create({
        clerkId: userId,
        name,
        email,
        location,
        role: role || "buyer",
      });
    } else {
      // Optional: keep user info in sync
      if (name) user.name = name;
      if (email) user.email = email;
      if (role) user.role = role;
      if (location) user.location = location;

      await user.save();
    }
    res.status(200).json({
        user
    })
  } catch (error) {
    console.error("User sync error:", error);
    res.status(500).json({ message: "Failed to sync user" });
  }
};

export default registerUser;
