class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode.toString().startsWith("4") ? "Fail" : "Internal Server Error";
  }
}
module.exports = AppError;
