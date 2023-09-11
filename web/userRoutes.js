const express = require("express");
const router = express.Router();
const userHandler = require("../handlers/user");
const auth = require("../middleware/user_jwt");
const multer  = require('multer');
const upload = multer({ dest: './uploads/users/'});

router.get("/", auth, userHandler.privateProfile);

router.get("/search", userHandler.search);

router.get("/follow/:username" , auth, userHandler.follow);

router.get("/:username", userHandler.publicProfile);

router.get('/:username/post',userHandler.post);

router.get('/:username/liked', userHandler.liked);

router.get('/:username/follower', userHandler.follower);

router.get('/:username/following', userHandler.following);

router.put('/:username/update', auth, upload.single("image"), userHandler.update);

router.delete("/:username/delete", auth, userHandler.delete)


module.exports = router;