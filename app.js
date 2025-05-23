import dotenv from "dotenv";
import express from "express";
import connectDB from "./DB/db.js";
import userRoutes from "./routes/userRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api", homeRoutes);
app.use("/api", adminRoutes);
app.use("/api", imageRoutes);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
