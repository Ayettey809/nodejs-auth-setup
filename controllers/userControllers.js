import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
	try {
		const { username, email, password, role } = req.body;

		const existingUser = await User.findOne({ $or: [{ username }, { email }] });
		if (existingUser) {
			return res
				.status(400)
				.json({ message: "Email or username already exists" });
		}

		const salt = await bcrypt.genSalt(12);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = new User({
			username,
			email,
			password: hashedPassword,
			role,
		});

		await user.save();

		if (user) {
			res.status(201).json({ message: "User created successfully", user });
		}

		/////////
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ message: "something went wrong" });
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({ message: "Invalid credentials" });
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(404).json({ message: "Invalid credentials" });
		}

		//create user token
		const accessToken = jwt.sign(
			{
				userId: user._id,
				username: user.username,
				role: user.role,
			},
			process.env.JWT_SECRET_KEY,
			{ expiresIn: "15m" }
		);

		res.status(200).json({
			success: true,
			message: "User logged in successfully",
			accessToken,
		});

		///////
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "something went wrong" });
	}
};

export const changePassword = async (req, res) => {
	try {
		const userId = req.userInfo.userId;
		const { oldPassword, newPassword } = req.body;

		//find current user
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		//check if old password is correct
		const isMatch = await bcrypt.compare(oldPassword, user.password);

		if (!isMatch) {
			return res.status(400).json({ message: "Invalid old password" });
		}

		//hash new password
		const salt = await bcrypt.genSalt(12);
		const hashedPassword = await bcrypt.hash(newPassword, salt);

		//update password
		user.password = hashedPassword;
		await user.save();

		res.status(200).json({ message: "Password changed successfully" });

		/////
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "something went wrong" });
	}
};
