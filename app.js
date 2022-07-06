const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./Routes/userRoutes");
const homeRouter = require("./Routes/homeRoutes");
const globalErrorHandler = require("./Controllers/errorController");
const app = express();
app.use(express.json());
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection Successful!");
  })
  .catch((err) => {
    console.log(err);
  });
  
app.use("/user", userRouter);
app.use("/home", homeRouter);
app.use(globalErrorHandler);

module.exports = app;
