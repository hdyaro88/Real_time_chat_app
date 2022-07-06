const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const db = process.env.DATABASE.replace("<PASSWORD>", process.env.PASSWORD);
const mongodb = require("mongodb");
const upload = require("./upload_handler");
const client = new mongodb.MongoClient(db, { useUnifiedTopology: true });

exports.upload_file = async (req, res, next) => {
  try {
    await upload(req, res);
    console.log("file uploaded successfully !");
    res.status(200).json({
      status: "File uploaded successfully !",
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: "Failed",
      message: err,
    });
  }
};

exports.getFile = async (req, res, next) => {
  try {
    await client.connect();

    const db1 = client.db("chat_app");

    const bucket = new mongodb.GridFSBucket(db1, { bucketName: "photos" });

    let downloadStream = bucket.openDownloadStreamByName(req.params.id);
    downloadStream.on("data", function (data) {
      return res.status(200).write(data);
    });
    downloadStream.on("error", function (err) {
      return res.status(404).send({ message: "Cannot download the Image!" });
    });
    downloadStream.on("end", () => {
      return res.end();
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: "Failed to fetch data",
    });
  }
};
