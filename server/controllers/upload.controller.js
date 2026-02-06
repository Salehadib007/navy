import { uploadToImageBB } from "../utils/imagebb.js";

export const uploadImage = async (req, res) => {
  try {
    console.log(
      "FILE:",
      req.file?.originalname,
      req.file?.mimetype,
      req.file?.size,
    );

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = await uploadToImageBB(
      req.file.buffer,
      req.file.originalname,
    );

    return res.status(200).json({ imageUrl });
  } catch (error) {
    console.log("UPLOAD ERROR FULL:", error); // 👈 must print
    return res.status(500).json({
      message: "Image upload failed",
      error: error?.message || error,
    });
  }
};
