const util = require("util");
const { GridFsStorage } = require("multer-gridfs-storage");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const db = process.env.DATABASE.replace("<PASSWORD>", process.env.PASSWORD);
const multer = require("multer");
const storage = new GridFsStorage({
  url: DB,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    // console.log(file);
    const match = ["image/png", "image/jpeg"];
    if (match.indexOf(file.mimetype) === -1) {
      const filename = req.params.id;
      return filename;
    }
    return {
      bucketName: "photos",
      filename: req.params.id,
    };
  },
});
const upload_files = multer({ storage: storage }).single("file");
var uploadFilesMiddleware = util.promisify(upload_files);
module.exports = uploadFilesMiddleware;
