//Import Cloudinary Packages

const cloudinary = require('cloudinary').v2; 
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Config Cloudinary Upload with Name and API keys
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})


// Config Storage as Photos Format Only.
const storage = new CloudinaryStorage({
    cloudinary,
    params: {

        folder: 'Hang',
        allowedForrmats: ['jpeg', 'png', 'jpg']

    }
})

// Export Cloudinary and Storage
module.exports = {
    cloudinary,
    storage
}