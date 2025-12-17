import { log } from "console";
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
      reportedBy: mongoUser._id,
    });
    return res.status(201).json({
      success: true,
      message: "Crop Details register successfully",
      data: newCrop,
    });
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

export const getUserCrops = async (req, res) => {
  try {
    const { userId } = req.auth(); // Clerk ID

    // 1️⃣ Find Mongo user
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2️⃣ Query crops using Mongo ObjectId
    const crops = await Crop.find({ reportedBy: user._id })
      .sort({ createdAt: -1 })
      .populate("reportedBy", "name email");

    return res.status(200).json({
      success: true,
      message: "Fetched user registered crops",
      data: crops,
    });
  } catch (err) {
    console.error("User crop fetch error", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateUserCrop = async (req, res) => {
  try {
    const { cropId } = req.params;
    // console.log("cropId in updateUserCrop controller : ", cropId);
    const crop = await Crop.findById(cropId);
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "These crop is not found",
      });
    }
    const {
      name,
      category,
      productionYear,
      description,
      price,
      location,
      available,
    } = req.body;

    if (name) crop.name = name;
    if (category) crop.category = category;
    if (productionYear) crop.productionYear = productionYear;
    if (description) crop.description = description;
    if (price) crop.price = price;
    if (location) crop.location = location;
    if (available) crop.available = available;

    if (req.file?.path) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "issues",
        resource_type: "auto",
      });
      crop.imageUrl = result.secure_url;
    }
    await crop.save();
    return res.status(200).json({
      success: true,
      data: crop,
      message: "Crop updated successfully",
    });
  } catch (error) {
    console.log("Error in updating crop : ", error);
    return res.status(500).json({
      success: false,
      message: "Server error in updating crop",
    });
  }
};

export const getSingleCrop = async (req, res) => {
  try {
    const { cropId } = req.params;
    // console.log("cropId in getSingleCrop controller : ", cropId);
    const crop = await Crop.findById(cropId).populate("reportedBy", "name email mobileNo");
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "These crop is not found",
      });
    } else {
      return res.status(200).json({
        success: true,
        data: crop,
        message: "Crop Detail get successfully",
      });
    }
  } catch (error) {
    console.log("Error in finding crop : ", error);
    return res.status(500).json({
      success: false,
      message: "Server error in finding crop",
    });
  }
};

export const deleteCrop = async (req, res) => {
  try {
    const { cropId } = req.params;
    const crop = await Crop.findById(cropId);

    if (!crop) {
      return res
        .status(404)
        .json({ success: false, message: "crop not found" });
    }

    const { userId } = req.auth();
    const mongoUser = await User.findOne({ clerkId: userId });
    if (!mongoUser) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this crop",
      });
    }
    // console.log("USer to delete the crop : ",mongoUser._id);
    if (crop.reportedBy.toString() !== mongoUser._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this crop",
      });
    }

    await crop.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Crop deleted successfully" });
  } catch (err) {
    console.error("Delete Crop Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error deleting crop" });
  }
};
