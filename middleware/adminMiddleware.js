export const isAdminUser = (req, res, next) => {
	if (req.userInfo.role !== "admin") {
		return res.status(403).json({ message: "Forbidden" });
	}
	next();
};
