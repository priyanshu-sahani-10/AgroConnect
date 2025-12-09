import User from "../models/user.model.js";

export const registerUser = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { name, email, role, location,mobileNo } = req.body || {};
    let user = User.findOne({ clerkId: userId });
    if (!user) {
      //create new user
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
      if(!name || !email || !role || !location || !mobileNo){
        res.status(201).json({
          success:false,
          message:"All field are required",
        })
      }
      user.name = name;
      user.email = email;
      user.role = role;
      user.location = location;
      user.mobileNo=mobileNo;  

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

export const syncUser = async (req,res)=>{
  const {userId}=req.auth;
  const {email}=req.body;
}

