import express from "express";
import {
	deleteImage,
	fetchImages,
	uploadImage,
} from "../controllers/imageControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdminUser } from "../middleware/adminMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
	"/upload",
	authMiddleware,
	isAdminUser,
	upload.single("image"),
	uploadImage
);

router.get("/images", authMiddleware, isAdminUser, fetchImages);
router.delete("/images/:id", authMiddleware, isAdminUser, deleteImage);

export default router;
