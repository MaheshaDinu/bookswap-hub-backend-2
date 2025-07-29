import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination:(req, file, cb) =>{
        cb(null, path.join("../public/uploads"));
    },
    filename:(req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    }
});

const upload = multer({
    storage: storage,
    limits:{
        fileSize: 1024 * 1024 * 5
    },
    fileFilter:(req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true); // Accept the file
        } else {
            cb(new Error('Only images (jpeg, jpg, png, gif) are allowed!')); // Reject the file
        }
    }
});

export default upload;