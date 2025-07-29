import multer from "multer";

export const saveImage = async (req: any, res: any) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const imageUrl = `/public/uploads/${req.file.filename}`
        res.status(200).json({
            message: "Image uploaded successfully",
            filename: req.file.filename,
            path: req.file.path,
            url: imageUrl
        });
    } catch (error) {
        if (error instanceof multer.MulterError) {
            console.error(error);
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: "An unknown error occurred" });
        }
    }
}