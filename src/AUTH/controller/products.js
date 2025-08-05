
const product = require ("../model/products");


//createproducts
exports.createProducts = async (req,res)=>{
const { title, description,quantity, image, categories, size, color, price}=req.body;

try {
   const newproduct = new product ({
     title,
     description,
     quantity,
     image,
     categories,
     size,
     color,
     price, 

  })
   const savedproduct = await newproduct.save()
  res.status(201).json({
  message: "Product added successfully",
  product: savedproduct, // ✅ now used
});

} catch (error) {
   console.error("Product creation failed:", error);
  res.status(500).json({
    message: "Failed to add product",
    error: error.message,
  }) 
}
};

//BUYPRODUCT
exports.buyproducts = async (req, res) => {
  const { productId, buyQuantity } = req.body;

  // STEP 1: Check that productId and buyQuantity are provided
  if (!productId || buyQuantity === undefined) {
    return res.status(400).json({ message: 'productId and buyQuantity are required' });
  }

  // STEP 2: Make sure buyQuantity is a real number
  const quantityToBuy = Number(buyQuantity);
  if (isNaN(quantityToBuy) || quantityToBuy <= 0) {
    return res.status(400).json({
      message: 'Invalid buyQuantity. Must be a number greater than 0.',
    });
  }

  try {
    // STEP 3: Find the product by ID
    const products = await product.findById(productId);
    if (!products) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // STEP 4: Check if enough stock is available
    if (products.quantity < quantityToBuy) {
      return res.status(400).json({
        message: `Insufficient stock. Only ${products.quantity} units left.`,
      });
    }

    // STEP 5: Subtract the quantity and save
    const newQuantity = products.quantity - quantityToBuy;

    if (isNaN(newQuantity)) {
      return res.status(400).json({ message: 'Something went wrong with quantity calculation' });
    }

    products.quantity = newQuantity;
    await products.save();

    // STEP 6: Respond with success
    res.status(200).json({
      message: 'Purchase successful',
      products: products.title,
      quantityBought: quantityToBuy,
      remainingStock: products.quantity,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error processing purchase',
      error: err.message,
    });
  }
};

//getproduct

exports.getproduct = async (req,res) => {
  try {
    // Example: you can get category from query string like ?category=clothing
    const category = req.query.category || "default-category";

    const foundProduct = await product.findOne({ categories:  { $in: [category] } });

    if (!foundProduct) {
      return res.status(404).json({ message: "No product found" });
    }

    res.status(200).json(foundProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error retrieving product",
      error: error.message,
    });
  }
};


//updateproduct
exports.updatedProduct = async (req, res) => {
  const { productId, newProductData } = req.body;

  try {
    const updatedProduct = await product.findByIdAndUpdate(
      productId,                 // Find product by ID
      { $set: newProductData },  // Apply the updates
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        status: "error",
        message: "Product not found with the specified ID",
      });
    }

    console.log("Updated product:", updatedProduct); // Optional debugging

    return res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error during product update",
    });
  }
};

//deleteproduct

exports.deleteProduct = async (req, res) => {
  const { title } = req.body; // You can replace 'title' with 'slug' or 'sku' if preferred

  try {
    const deletedProduct = await product.findOneAndDelete({ title });

    if (!deletedProduct) {
      return res.status(404).json({
        status: "error",
        message: "Product not found or already deleted",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Product successfully deleted",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error while deleting product",
    });
  }
};

//get all product

exports.getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;

    // If category is provided, filter products by it
    const filter = category ? { categories: { $in: [category] } } : {};

    const products = await product.find(filter);

    if (products.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No products found for the specified category",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error while retrieving products",
      error: error.message,
    });
  }
};
