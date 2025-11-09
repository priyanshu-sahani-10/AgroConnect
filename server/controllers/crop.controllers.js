import Crop from "../models/crop.model";

const uploadCrop = async (req, res) => {
  try {
    const {
      name,
      description,
      imageUrl,
      productionYear,
      available,
      price,
      location,
    } = req.body;
    if (
      !name ||
      !description ||
      !imageUrl ||
      !productionYear ||
      !available ||
      !price ||
      !location
    ) {
      return res.status(400).json({
        success: false,
        message: "All field are required",
      });
    }
    const newCrop = await Crop.create({
      name,
      description,
      imageUrl,
      productionYear,
      available,
      price,
      location,
    });
    return res.status(201).json({
        success:true,
        message:"Crop Details uploaded successfully",
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
