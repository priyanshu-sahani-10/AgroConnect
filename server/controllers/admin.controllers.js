import User from "../models/user.model.js";
import Order from "../models/order.model.js";

export const getAdminAllUsers= async(req,res)=>{
    try {
        const {userId}=req.auth;
    const mongoUser= await User.findOne({clerkId:userId});
    if(!mongoUser){
        return res.status(404).json({
            success:false,
            message:"User not found."
        })
    }
    const userRole=mongoUser.role;
    if(userRole!=="admin"){
        return res.status(401).json({
            success:false,
            message:"User are not allowed to get this data.Only Admin can see it."
        })
    }
    const users=await User.find();
    return res.status(200).json({
        success:true,
        message:"User fetched successfully",
        users:users,
    })
    } catch (error) {
        console.log("Server err in getAdminAllUsers : ",error);        
        return res.status(500).json({
            success:false,
            message:"Internal server error in getAdminAllUsers."
        })
    }
}


export const getAdminAllOrders=async(req,res)=>{
    try {
        const {userId}=req.auth;
    const mongoUser= await User.findOne({clerkId:userId});
    if(!mongoUser){
        return res.status(404).json({
            success:false,
            message:"User not found."
        })
    }
    const userRole=mongoUser.role;
    if(userRole!=="admin"){
        return res.status(401).json({
            success:false,
            message:"User are not allowed to get this data.Only Admin can see it."
        })
    }
    const orders = await Order.find()
      .populate("crop", "name imageUrl price")
      .populate("buyer", "name mobileNo")
      .populate("farmer", "name mobileNo")
      .sort({ createdAt: -1 });
    
    return res.status(200).json({
        success:true,
        message:"User fetched successfully",
        orders:orders,
    })
    } catch (error) {
        console.log("Server err in getAdminAllOrders : ",error);        
        return res.status(500).json({
            success:false,
            message:"Internal server error in getAdminAllOrders."
        })
    }
}


export const blockUnblockUser = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { Id } = req.params;
    const { isBlocked } = req.body;

    // Check admin
    const mongoUser = await User.findOne({ clerkId: userId });
    if(!mongoUser){
        return res.status(404).json({
            success:false,
            message:"Admin not found."
        })
    }
    if (mongoUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can block/unblock users",
      });
    }

    // Update user
    const userToBlock=await User.findById(Id);
    if(userToBlock.role==="admin"){
      return res.status(200).json({
        success:true,
        message:"You can't block admin of AgroConnect",
      })
    }
    const updatedUser = await User.findByIdAndUpdate(
      Id,
      { isBlocked },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: isBlocked
        ? "User blocked successfully"
        : "User unblocked successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in blockUnblockUser:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
