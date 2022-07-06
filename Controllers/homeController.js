const Message = require("../Models/messageModel");
const bcrypt = require("bcryptjs");
const minString = (string1, string2) => {
  if (string1 < string2) {
    return string1;
  } else {
    return string2;
  }
};
const maxString = (string1, string2) => {
  if (string1 > string2) {
    return string1;
  } else {
    return string2;
  }
};
exports.createChat = async (req, res, next) => {
  const { senderID, recieverID, message } = req.body;
  const chatID = [minString(senderID, recieverID), maxString(senderID, recieverID)].join("-");
  try {
    const chat = await Message.findOneAndUpdate(
      { chatID },
      { $push: { chatArray: req.body.chatArray[0] } },
      {
        new: true,
        upsert: true,
      }
    );
    res.status(200).json({
      status: "Success",
      data: { chat: chat.chatArray[chat.chatArray.length - 1] },
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err,
    });
  }
};

exports.getChats = async (req, res, next) => {
  try {
    const chats = await Message.find({ chatID: req.query.chatID });
    res.status(200).json({
      status: "Success",
      data: {
        chats,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err,
    });
  }
};
