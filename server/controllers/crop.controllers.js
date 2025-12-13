import Crop from "../models/crop.model.js";
import User from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";

export const RegisterCrop = async (req, res) => {
  try {
    const {
      name,
      description,
      productionYear,
      available,
      price,
      location,
      category,
    } = req.body;

    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto",
        folder: "issues",
      });
      imageUrl = result.secure_url;
    }

    if (
      !name ||
      !description ||
      !productionYear ||
      !available ||
      !price ||
      !location ||
      !category ||
      !imageUrl
    ) {
      return res.status(400).json({
        success: false,
        message: "All field are required",
      });
    }
    const { userId } = req.auth();
    const mongoUser = await User.findOne({ clerkId: userId });
    // console.log("UserId for register crop : ",userId);    
    // console.log("MongoUser for register crop : ",mongoUser);    
    const newCrop = await Crop.create({
      name,
      description,
      imageUrl,
      productionYear,
      available,
      price,
      location,
      category,
      reportedBy:mongoUser._id,
    });
    return res.status(201).json({
        success:true,
        message:"Crop Details register successfully",
        data:newCrop
    })
  } catch (error) {
    console.error("❌ Crop Details uploading  failed:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const getAllCrops = async (req, res) => {
  try {
    const crops = await Crop.find()
      .populate("reportedBy", "name")
      .sort({ createdAt: -1 });

    if (!crops || crops.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No crops found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Crops fetched successfully",
      data: crops,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

