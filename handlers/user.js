const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const Post = require("../models/post");

class UserHandler {
  async privateProfile(req, res) {
    try {
      const user = await User.findById(req.user.id, {
        profilePictire: 1,
        name: 1,
        about: 1,
        username: 1,
        email: 1,
      });
      res.status(200).json({
        user: user,
      });
    } catch (err) {
      res.status(500).json({
        msg: `Server Error :${err}`,
      });
    }
  }

  async publicProfile(req, res) {
    try {
      const user = await User.findOne(req.params, {
        profilePictire: 1,
        name: 1,
        about: 1,
        username: 1,
      });
      res.status(200).json({
        user: user,
      });
    } catch (err) {
      res.status(500).json({
        msg: `Server Error :${err}`,
      });
    }
  }

  async search(req, res) {
    try {
      const user = await User.find(
        {
          $or: [
            { username: { $regex: req.query.q, $options: "i" } },
            { name: { $regex: req.query.q, $options: "i" } },
          ],
        },
        { profilePictire: 1, name: 1, about: 1, username: 1 }
      );

      res.status(200).json({
        user: user,
      });
    } catch (err) {
      res.status(500).json({
        msg: `Server Error :${err}`,
      });
    }
  }

  async post(req, res) {
    try {
      const user = await User.findOne(req.params);
      if (!user.posted.length) {
        return res.status(404).json({
          msg: "Nothing to see for now",
        });
      }
      console.log(user.posted);
      const posts = await Post.find({ _id: user.posted }).select({
        preview: 1,
        title: 1,
        CreatedAt: 1,
      });

      res.status(200).json({
        post: posts,
      });
    } catch (err) {
      res.status(500).json({
        msg: `Server Error: ${err}`,
      });
    }
  }

  async liked(req, res) {
    try {
      const user = await User.findOne(req.params);

      if (!user.liked.length) {
        return res.status(404).json({
          msg: "Nothing to see for now",
        });
      }
      const posts = await Post.find({ _id: user.liked }).select({
        preview: 1,
        title: 1,
        CreatedAt: 1,
      });

      res.status(200).json({
        post: posts,
      });
    } catch (err) {
      res.status(500).json({
        msg: `Server Error: ${err}`,
      });
    }
  }

  async follower(req, res) {
    try {
      const user = await User.findOne(req.params);
      const follower = await User.find({ _id: user.follower }).select({
        _id: 0,
        name: 1,
        username: 1,
      });

      res.status(200).json({
        follower: follower,
      });
    } catch (err) {
      res.status(500).json({
        msg: `Server Error: ${err}`,
      });
    }
  }

  async following(req, res) {
    try {
      const user = await User.find(req.params);
      const following = await User.find({ _id: user.following }).select({
        _id: 0,
        name: 1,
        username: 1,
      });

      res.status(200).json({
        following: following,
      });
    } catch (err) {
      res.status(500).json({
        msg: `Server Error: ${err}`,
      });
    }
  }

  //Follow and UnFollow
  async follow(req, res) {
    try {
      const followUserObject = await User.findOne(req.params);
      const currentUserObject = await User.findById(req.user.id);
      if (followUserObject.id == currentUserObject.id) {
        return res.status(405).json({
          msg: "You cannot follow your account",
        });
      }
      if (!currentUserObject.following.includes(followUserObject.id)) {
        await followUserObject.updateOne({ $push: { follower: req.user.id } });
        await currentUserObject.updateOne({
          $push: { following: followUserObject.id },
        });
        res.status(200).json({
          msg: "Profile followed",
        });
      } else {
        await followUserObject.updateOne({ $pull: { follower: req.user.id } });
        await currentUserObject.updateOne({
          $pull: { following: followUserObject.id },
        });
        res.status(200).json({
          msg: "Profile unfollowed",
        });
      }
    } catch (err) {
      res.status(500).json({
        msg: `Server Error :${err}`,
      });
    }
  }

  async update(req, res) {
    try {
      const email_exist = await User.findOne({ email: req.body.email });
      if (email_exist) {
        return res.status(409).json({
          msg: `Email already existing`,
        });
      }
      const username_exist = await User.findOne({
        username: req.body.username,
      });
      if (username_exist) {
        return res.status(409).json({
          msg: `Username already existing`,
        });
      }
      let password = undefined;
      if(req.body.newpassword){
        const salt = await bcryptjs.genSalt(10);
        password = await bcryptjs.hash(req.body.newpassword, salt);
      }
      await User.findByIdAndUpdate(req.user.id, {
        $set: {
          profilePictire: req.file.path,
          email: req.body.email,
          username: req.body.username,
          name: req.body.name,
          about: req.body.about,
          password: password,
        },
      });
      res.status(202).json({
        msg: `Account updated`,
      });
    } catch (err) {
      return res.status(500).json({
        msg: `Server Error: ${err}`,
      });
    }
  }

  async delete(req, res) {
    try {
      await Post.deleteMany({ user: req.user.id });
      await User.updateMany({ $pull: { follower: req.user.id } });
      await Post.updateMany({ $pull: { like: req.user.id } });
      await User.findByIdAndDelete(req.user.id);
      res.status(200).json({
        msg: "Account Deleted",
      });
    } catch (err) {
      return res.status(500).json({
        msg: `Server Error: ${err}`,
      });
    }
  }
}
module.exports = new UserHandler();