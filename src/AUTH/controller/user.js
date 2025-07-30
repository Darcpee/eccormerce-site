const express =require("express");
const mogoose = require("mongoose");
const salt=10;
const bcrypt= require("bcrypt");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
//const user = require("../model/user");





//check for existing user
 exports.existinguser = async(req,res)=>{
     const { username, email, password } = req.body;

     try {
         const existingUser = await User.findOne({email});
        if (!existingUser) {
          return res.status(500).json("user doesnt exist")
        } else {
         res.status(200).json("user existing");
        }
     } catch (error) {
        console.log(error); 
     }
 };


//registeruser
exports.registerUser = async (req,res)=>{
   const username = req.body.username;
   const email = req.body.email;
   const password = req.body.password;

   const hashedpassword = await bcrypt.hash(password,salt);

   try {
    const newUser = new User({
        username:username,
        email:email,
        password:hashedpassword,
    })
    const saveduser = await newUser.save();
    res.status(201).json(saveduser)
   } catch (error) {
    res.status(500).json(error);
    console.log(error);
   }
   
}


//userlogin

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", { email, password });

  // Check if both fields are provided
  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Email and password are required",
    });
  }

  try {
    // Check if user exists
    const loginuser = await User.findOne({ email });
    console.log("Found user:", loginuser);

    if (!loginuser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Check password match
    console.log("Stored password:", loginuser.password);
    console.log("Comparing passwords...");
    const isMatch = await bcrypt.compare(password, loginuser.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        message: "Invalid password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: loginuser._id }, // lowercase userId is more standard
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Respond with token and user info
    return res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
      user: {
        id: loginuser._id,
        username: loginuser.username,
        email: loginuser.email,
        password: loginuser.password,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

//updateUser
exports.updateUser = async(req,res) =>{
    const { username, newusername } = req.body;

     try {
    const updatedUser = await User.findOneAndUpdate(
      { username }, // Find by name
      { $set: newusername }, // Apply updates
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found with the specified name",
      });
    }

    console.log("Updated user:", updatedUser); // For debugging (optional)

    return res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: updatedUser,
    });

  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error during user update",
    });
  }
};

//updateuserByID
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;        // Get user ID from URL
     console.log("Received ID:", id);

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Validate fields based on schema
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      status: 'success',
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

//deleteuser

exports.DeleteUser = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const deletedUser = await User.findOneAndDelete({ email });

    if (!deletedUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found or already deleted",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "User account successfully deleted",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error while deleting user",
    });
  }
};

//getalluser
// controllers/userController.js

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    // ✅ Fetch all users from the database
    const users = await User.find().select('-password'); // Exclude passwords

    // ✅ If no users found
    if (!users || users.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No users found',
      });
    }

    // ✅ Success
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: users,
    });
  } catch (error) {
    // ✅ Server error
    console.error('Error fetching users:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch users',
    });
  }
};



  






