import Cart from "../models/cart.model.js";
import Crop from "../models/crop.model.js";
import User from "../models/user.model.js";

export const addToCart = async (req, res) => {
  try {
    // Clerk userId
    const { userId } = req.auth;

    // Find Mongo user
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { cropId } = req.params;

    const crop = await Crop.findById(cropId);
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
      });
    }

    let cart = await Cart.findOne({ buyer: user._id });

    if (!cart) {
      cart = new Cart({ buyer: user._id, items: [] });
    }

    const itemExists = cart.items.find(
      (item) => item.cropId.toString() === cropId
    );

    if (itemExists) {
      return res.status(200).json({
        success: true,
        message: "Crop already added to cart",
      });
    }

    cart.items.push({
      cropId: crop._id,
      name: crop.name,
      price: crop.price,
      imageUrl: crop.imageUrl,
      available: crop.available,
    });

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Crop added successfully to your cart",
      cart,
    });
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(500).json({
      success: false,
      message: "Server error in add cart",
    });
  }
};


export const getCart = async (req, res) => {
  try {
    const { userId } = req.auth;

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const cart = await Cart.findOne({ buyer: user._id });

    if (!cart) {
      return res.status(200).json({
        success: true,
        items: [],
      });
    }

    res.status(200).json({
      success: true,
      items: cart.items,
    });
  } catch (error) {
    console.error("Error in getCart:", error);
    res.status(500).json({
      success: false,
      message: "Server error in get cart",
    });
  }
};



export const removeFromCart = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { cropId } = req.params;

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const cart = await Cart.findOne({ buyer: user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.cropId.toString() !== cropId
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      items: cart.items,
    });
  } catch (error) {
    console.error("Error in removeFromCart:", error);
    res.status(500).json({
      success: false,
      message: "Server error in remove cart item",
    });
  }
};





export const clearCart = async (req, res) => {
  try {
    const { userId } = req.auth;

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const cart = await Cart.findOne({ buyer: user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error("Error in clearCart:", error);
    res.status(500).json({
      success: false,
      message: "Server error in clear cart",
    });
  }
};
