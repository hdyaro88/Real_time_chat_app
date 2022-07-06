const AppError = require("../utils/AppError");

const productionError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    // err: err,
    message: err.message.toString(),
  });
};

const developmentError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
  });
};

module.exports = (err, req, res, next) => {
  err.status = err.status || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "production") {
    let error = err;
    if ("errors" in error) {
      error = new AppError(err.errors[Object.keys(err.errors)[0]].message, err.statusCode);
    } else if (error.message.includes("dup")) {
      error = new AppError(`${Object.keys(error.keyValue)[0]} : already exists`, err.statusCode);
    }
    productionError(error, res);
  } else {
    developmentError(err, res);
  }
};
