const Product = require("../model/products"); // Make sure this points to your correct model path

// Search products by keyword (title or description)
exports.searchproducts = async (req, res) => {
  const keyword = req.query.q; // Use a meaningful variable name

  if (!keyword) {
    return res.status(400).json({ message: "Search query 'q' is required" });
  }

  try {
    const results = await Product.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } }
      ]
    });

    if (results.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json({
      message: `Found ${results.length} product(s) for "${keyword}"`,
      data: results
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




