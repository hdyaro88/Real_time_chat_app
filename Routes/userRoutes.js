const express = require("express");
const userControls = require("../Controllers/userController");
const uploadControls = require("../Controllers/upload_controller");
const app = require("../server");
const router = express.Router();

router.post("/signup", userControls.signUp);
router.post("/login", userControls.signIn);
router.route("/").get(userControls.getUsers).post(userControls.getFriends);
// router.route("/:query").;
router.route("/addFriend").post(userControls.addFriend);
router.route("/profile_pic/:id").get(uploadControls.getFile).post(uploadControls.upload_file);
module.exports = router;
