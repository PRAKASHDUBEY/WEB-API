const express = require("express");
const router = express.Router();
const postHandler = require("../handlers/post");
const auth = require("../middleware/user_jwt");
const multer  = require('multer');
const upload = multer({ dest: './uploads/post/'});

router.post('/new', auth, upload.single('post'),  postHandler.create);

router.get('/following',auth, postHandler.following)

router.put('/like', auth, postHandler.like)

router.put('/update/:id', auth, postHandler.update)

router.delete('/delete/:id', auth, postHandler.delete )

module.exports = router;