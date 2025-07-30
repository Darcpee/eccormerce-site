const express =require ("express");
const app = express();
const mongoose = require ("mongoose");
const router = require("./routes");
const dotenv = require("dotenv").config();
const myDB = process.env.DB
//console.log("JWT Secret:", process.env.JWT_SECRET);




app.use(express.json());
app.use("/",router);





app.listen(5000, async()=>{
    console.log("server is running on 5000");
    try {
        await mongoose.connect(myDB)
        console.log("DB is connected")
    } catch (error) {
      console.log(error)  
    }
})