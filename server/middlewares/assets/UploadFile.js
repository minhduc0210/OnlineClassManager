const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { nanoid } = require("nanoid");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const parts = req.originalUrl.split("/");
    const requestPath = parts.length > 2 ? parts[2] : "default";
    const publicDir = path.join(__dirname, "../../../public");
    const fileDir = path.join(publicDir, "uploads", requestPath);
    fs.mkdirSync(fileDir, { recursive: true }); 
    cb(null, fileDir);
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname); 
    const sign = nanoid(3);
    const userID = req.user?.id || "unknown";
    const classroomID = req.params?.classroomID || "no-classroom";
    const fileName = `${classroomID}-${userID}-${sign}${extension}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

module.exports = upload;
