const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderID: {
    type: String,
    required: [true, "A sender id is must"],
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});
const Schema = new mongoose.Schema({
  chatID: {
    type: String,
    required: [true, "A chat id is required"],
    unique: true,
    trim: true,
  },
  chatArray: [messageSchema],
});

// Schema.pre("save", function (next) {
//   this.chatID = [
//     Math.min(this.chatArray.senderID, this.chatArray.recieverID),
//     Math.max(this.chatArray.senderID, this.chatArray.recieverID),
//   ].join("-");
//   next();
// });
const Message = mongoose.model("Message", Schema, "messages");

module.exports = Message;
