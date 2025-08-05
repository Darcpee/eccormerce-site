const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();
const multer = require ('multer');
const { CloudinaryStorage} =require  ('multer-storage-cloudinary');



cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
const storage =new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:'image',
        allowed_formats:[ 'jpg','png','jpeg'],
    },
});
const upload =multer({
    storage:storage
});

module.exports = { cloudinary,upload};



