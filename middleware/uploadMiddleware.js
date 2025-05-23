import multer from "multer";
import path from "path";

//set multer storage
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "upload/");
	},
	filename: function (req, file, cb) {
		cb(
			null,
			file.fieldname + "-" + Date.now() + path.extname(file.originalname)
		);
	},
});

//file filter
const fileFilter = (req, file, cb) => {
	if (file.mimetype.startsWith("image")) {
		cb(null, true);
	} else {
		cb(new Error("Not an image! Please upload an image"), false);
	}
};

//upload middleware
export const upload = multer({
	storage,
	fileFilter,
	limits: { fieldSize: 10 * 1024 * 1024 },
});
