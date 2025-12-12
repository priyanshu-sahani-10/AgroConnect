import Crop from "../models/crop.model.js";
import cloudinary from "../utils/cloudinary.js";

const RegisterCrop = async (req, res) => {
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
    const newCrop = await Crop.create({
      name,
      description,
      imageUrl,
      productionYear,
      available,
      price,
      location,
      category,
      postedBy:userId,
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

export default RegisterCrop;
