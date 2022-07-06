const UserModel = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const jwtSignin = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
exports.signUp = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  const user = await UserModel.create({
    name: name?.toLowerCase(),
    email,
    password,
    confirmPassword,
  });
  const token = jwtSignin(user._id);
  res.status(201).json({
    status: "Success",
    token,
    data: {
      user,
    },
  });
});

exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //check if user exist
  const user = await UserModel.findOne({ email }).select("+password");
  if (!user || !(await user.verifyPassword(password, user.password))) {
    throw new AppError("Incorrect email or password !", "400");
  }
  //retrun token if everything is fine
  const token = jwtSignin(user._id);
  res.status(200).json({
    status: "Success",
    token,
    data: {
      user,
    },
  });
});

exports.getUsers = catchAsync(async (req, res, next) => {
  const q = req.query.query?.toLowerCase();
  const _id = req.query.id;

  const users = await UserModel.find({ $or: [{ name: { $regex: `^${q}` } }, { _id }] });
  if (users.length == 0) {
    return next(new AppError("No matching user found !", "404"));
  }
  res.status(200).json({
    status: "Success",
    data: {
      users,
    },
  });
});

exports.addFriend = catchAsync(async (req, res, next) => {
  const user = await UserModel.findOneAndUpdate(
    { _id: req.body.id },
    { $addToSet: { friends: req.body.addFriend.toString() } },
    {
      new: true,
      upsert: true,
    }
  );
  await UserModel.findOneAndUpdate(
    { _id: req.body.addFriend },
    { $addToSet: { friends: req.body.id } },
    {
      upsert: true,
    }
  );
  res.status(201).json({
    status: "Succes",
    message: "added to the friend list",
    data: {
      user,
    },
  });
});

exports.getFriends = catchAsync(async (req, res, next) => {
  const users = await UserModel.find({ _id: { $in: req.body.friends } });
  const modified = [];
  users.forEach((el) => {
    const { id, email, name } = el;
    modified.push({ id, email, name });
  });
  res.status(200).json({
    status: "Success",
    data: {
      modified,
    },
  });
});
