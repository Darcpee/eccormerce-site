const express = require("express");
const { registerUser, loginUser, updateUser, DeleteUser, getAllUsers } = require("./src/AUTH/controller/user");
const products = require("./src/AUTH/model/products");
const { createProducts, updatedProduct, getproduct, deleteProduct, getAllProducts, buyproducts } = require("./src/AUTH/controller/products");
const { addToCart, getCart, updatedCart, deleteCart, getAllCarts } = require("./src/AUTH/controller/cart");
const { createOrder } = require("./src/AUTH/controller/order");
const { searchproducts } = require("./src/AUTH/controller/search");
const { upload } = require("./cloudinary");
const { uploadimage, uploadImage } = require("./src/AUTH/controller/uploadimage");
const router = express.Router();


router.post("/registeruser",registerUser);
router.get("/loginUser",loginUser);
//router.put("/updateUser",updateUser);
router.put("/users/update/:id", updateUser);
router.delete("/Deleteuser",DeleteUser);
router.get("/getALLUser",getAllUsers);
router.post("/createproducts",createProducts);
router.get("/getproduct",getproduct);
router.post("/buyproducts",buyproducts)
router.put("/updatedproduct",updatedProduct);
router.delete("/deleteproduct",deleteProduct);
router.get("/getAllProducts",getAllProducts);
router.post("/addToCart",addToCart);
router.get("/getcart",getCart);
router.put("/updateCart",updatedCart);
router.delete("/deletCart",deleteCart);
router.get("/getAllCarts",getAllCarts);
router.post("/createorder",createOrder);
router.get("/searchproducts",searchproducts);
router.post("/upload",upload.single("image"),uploadImage);







module.exports = router;