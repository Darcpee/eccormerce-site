const express = require("express");
const router = express.Router();
const axios = require("axios");

exports.payment = async()=>{
   const { amount, email } = req.body;
   
    try {
          const paystackRes = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        amount,
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(paystackRes.data.data); // Contains authorization_url, reference, etc.  
    } catch (error) {
      res.status(500).json({
      message: "Payment initialization failed",
      error: error.response.data,
    });  
    }
}