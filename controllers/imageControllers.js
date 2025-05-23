import Image from "../model/image.js";
import { uploadToCloudinary } from "../utils/helpers.js";
import fs from "fs";

export const uploadImage = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: "No file uploaded" });
		}

		//upload to cloudinary
		const { url, publicId } = await uploadToCloudinary(req.file.path);

		//create image document
		const image = new Image({
			url,
			publicId,
			uploadedBy: req.userInfo.userId,
		});

		await image.save();

		//delete local file
		fs.unlinkSync(req.file.path);

		return res
			.status(201)
			.json({ message: "Image uploaded successfully", image });

		/////////
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Error uploading image" });
	}
};

export const fetchImages = async (req, res) => {
	try {
		const images = await Image.find({});

		if (images) {
			return res.status(200).json({ success: true, images });
		}

		////
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Error fetching images" });
	}
};

export const deleteImage = async (req, res) => {
	try {
		const getCurrentImage = req.params.id;
		const userId = req.userInfo.userId;

		const image = await Image.findById(getCurrentImage);

		if (!image) {
			return res.status(404).json({ message: "Image not found" });
		}
		//CHECK IF USER IS THE OWNER OF THE IMAGE
		if (image.uploadedBy.toString() !== userId) {
			return res
				.status(403)
				.json({ message: "You are not authorized to delete this image" });
		}

		//delete it from cloudinary
		await cloudinary.uploader.destroy(image.publicId);

		//delete it from db
		await Image.findByIdAndDelete(getCurrentImage);

		return res.status(200).json({ message: "Image deleted successfully" });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Error deleting image" });
	}
};
