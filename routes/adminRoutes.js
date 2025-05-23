import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdminUser } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/admin", authMiddleware, isAdminUser, (req, res) => {
	res.json({ message: "Welcome to the admin page" });
});

export default router;
