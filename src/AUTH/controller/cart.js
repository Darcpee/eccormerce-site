

const cart = require("../model/cart");
const product=require("../model/products");
const mongoose = require("mongoose");

//ADD TO CART
 exports.addToCart = async (req, res) => {
   const { userId, productId, quantity } = req.body;
   // Check required fields
  if (!userId || !productId) {
    return res.status(400).json({ message: "userId and productId are required" });
  }

   // Check if productId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid productId format" });
  }
   
   try {

     // Check if the product exists
    const Product = await product.findById(productId);
    if (!Product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let Cart = await cart.findOne({ userId });
    if (!Cart || !Array.isArray(cart.products)) {
      
    } else {
       const existingProduct = cart.products.find(
        (p) => p.productId && p.productId.toString() === productId
      );
      
      if (existingProduct) {
         existingProduct.quantity += quantity || 1;
      } else {
        Cart.products.push({ productId, quantity: quantity || 1 });
      }
    }
    
    const newcart = new cart({
        userId,
        products:[{ productId, quantity: quantity || 1 }],
        
    })
    const savedcart = await newcart.save();
    // Populate full product info
    const populatedCart = await cart.findById(savedcart._id)
      .populate({
        path: "products.productId",
        strictPopulate: false, // Optional: avoid errors if schema is not strict
      });
    return res.status(201).json({
      message: "Product added to cart successfully",
      cart: populatedCart,
    });
   } catch (error) {
  console.error("Error adding to cart:", error);
    return res.status(500).json({
      message: "Failed to add product to cart",
      error: error.message,
    });
   }
};

//addcartbyname
exports.addCart = async (req, res) => {
  const { userId, productTitle, quantity } = req.body;

  // Check required fields
  if (!userId || !productTitle) {
    return res.status(400).json({ message: "userId and productTitle are required" });
  }

  try {
    // Find the product by title
    const foundProduct = await product.findOne({ title: productTitle });

    if (!foundProduct) {
      return res.status(404).json({ message: "Product not found with that title" });
    }

    const productId = foundProduct._id;

    let userCart = await cart.findOne({ userId });

    if (!userCart) {
      // Create a new cart if none exists
      userCart = new cart({
        userId,
        products: [{ productId, quantity: quantity || 1 }],
      });
    } else {
      // Cart exists, check if product is already in the cart
      const existingProduct = userCart.products.find(
        (p) => p.productId.toString() === productId.toString()
      );

      if (existingProduct) {
        existingProduct.quantity += quantity || 1;
      } else {
        userCart.products.push({ productId, quantity: quantity || 1 });
      }
    }

    const savedCart = await userCart.save();

    const populatedCart = await cart.findById(savedCart._id).populate({
      path: "products.productId",
      strictPopulate: false,
    });

    return res.status(201).json({
      message: "Product added to cart successfully using title",
      cart: populatedCart,
    });

  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({
      message: "Failed to add product to cart",
      error: error.message,
    });
  }
};






//GETCART
exports.getCart = async (req, res) => {

    const { userId } = req.params;

  // Validate userId
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid or missing userId" });
  }
  try {
    const userCart = await cart.findOne({ userId: req.params.userId }).populate("products.productId");

    if (!userCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    return res.status(200).json({
      message: "Cart fetched successfully",
      cart: userCart,
    });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

//UPDATECART
exports.updatedCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    const updatedCart = await cart.findByIdAndUpdate(
      productId,                 // Find cartproduct by ID
      { $set: req.body },  // Apply the updates
      { new: true, runValidators: true }
    );

    if (!updatedCart) {
      return res.status(404).json({
        status: "error",
        message: "cartProduct not found with the specified ID",
      });
    }

    console.log("Updated product:", updatedCart); // Optional debugging

    return res.status(200).json({
      status: "success",
      message: "cartproduct updated successfully",
      data: updatedCart,
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error during cartproduct update",
    });
  }
};

//DELETECART
exports.deleteCart = async (req, res) => {
  const { productId } = req.body; // You can replace 'title' with 'slug' or 'sku' if preferred

  try {
    const deletedCart = await cart.findOneAndDelete({ productId });

    if (!deletedCart) {
      return res.status(404).json({
        status: "error",
        message: "CartProduct not found or already deleted",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "CartProduct successfully deleted",
    });
  } catch (error) {
    console.error("Error deleting Cartproduct:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error while deleting product",
    });
  }
};

//GET ALL CART
// Get all carts with product details
exports.getAllCarts = async (req, res) => {
  try {
    const carts = await cart.find().populate({
      path: "products.productId",
      strictPopulate: false, // Optional
    });

    if (!carts || carts.length === 0) {
      return res.status(404).json({ message: "No carts found" });
    }

    res.status(200).json({
      message: "Carts retrieved successfully",
      carts,
    });
  } catch (error) {
    console.error("Error fetching carts:", error);
    res.status(500).json({
      message: "Failed to retrieve carts",
      error: error.message,
    });
  }
};



