const upload = require("../../../cloudinary");

exports.uploadImage = (req,res)=>{
    if (!req.file) {
        return res.status(400).json({ status: 'error', message: 'No image file uploaded' });
    }

     return res.status(200).json({
    status: 'success',
    message: 'Image uploaded successfully',
    data: {
      url: req.file.path,
      filename: req.file.path,
    },
  });
}