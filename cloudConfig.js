const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// configuration = (jodna)
// configuring backend with cloudinary account
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// defining storage
// folder name = wanderlust_dev
// saving files in folder = (format) "png","jpg","jpeg";
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust_DEV',
        allowerdFormats: ["png", "jpg", "jpeg"], // supports promises as well
    },
});

module.exports = {
    cloudinary,
    storage,
}