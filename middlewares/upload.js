const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storageDir = path.join(__dirname, '../utils/storage');

// Ensure the storage directory exists
if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
}

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        // Generate a unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + ".pdf");
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
