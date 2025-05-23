import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/home", authMiddleware, (req, res) => {
	res.json({ message: "Welcome to the home page", user: req.userInfo });
});

export default router;
