const express = require("express");
const homeControls = require("../Controllers/homeController");

const router = express.Router();

router.route("/chats").get(homeControls.getChats).post(homeControls.createChat);
module.exports = router;
