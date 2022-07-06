const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A name is definetly required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "A email is reuired to register."],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "A password is required"],
    minlength: [8, "Password should be of length greater than or equal to 8"],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Password did not match",
    },
  },
  friends: [{ type: String }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

Schema.methods.verifyPassword = async function (enteredPassword, actualPassword) {
  return await bcrypt.compare(enteredPassword, actualPassword);
};

Schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

const UserModel = mongoose.model("User", Schema, "users");

module.exports = UserModel;
