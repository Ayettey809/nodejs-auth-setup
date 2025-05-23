import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
	const authHeader = req.headers["authorization"];

	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	//decode the token
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
		req.userInfo = decoded;
		next();

		//////////////
	} catch (error) {
		console.log(error);
		res.status(401).json({ message: "Unauthorized" });
	}
};
