import mongoose from "mongoose";

const cropSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    productionYear: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    available: {
      type: Number,
      required: true,
      min: 0,
    },
    postedBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Crop = mongoose.model("Crop", cropSchema);
export default Crop;
