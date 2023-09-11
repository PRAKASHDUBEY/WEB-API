const User = require('../models/user');
const Post = require("../models/post");

class postHandler {

    async create(req, res) {
        try {
            const post = await Post.create({
                preview: req.file.path,
                title: req.body.title,
                user: req.user.id
            });
            await User.findByIdAndUpdate(req.user.id, {
                $push: { posted: verdict.id }
            });
            // const UserObject = await User.findById(req.user.id);
            // await UserObject.updateOne({
            //     $push: { posted: verdict.id }
            // });
            if (!post) {
                return res.status(400).json({
                    msg: "Something went wrong"
                });
            }
            res.status(200).json({ post: post });
        } catch (err) {
            res.status(500).json({
                msg: `Server Error :${err}`
            });
        }
    };

    async update(req, res) {
        try {
            let post = await Post.findById(req.params.id);
            if (!post) {
                return res.status(422).json({
                    msg: 'Verdict do not exist'
                });
            }
            await Post.findByIdAndUpdate(req.params.id, {
                $set: {
                    title: req.body.title,
                }
            }, {
                new: true,
                runValidators: true
            });
            return res.status(200).json({
                msg: "Verdict Updated"
            });
        } catch (err) {
            res.status(500).json({
                msg: `Server Error :${err}`
            });
        }
    };

    async delete(req, res) {
        try {
            await Post.findByIdAndDelete(req.params.id);
            await User.findByIdAndUpdate(req.user.id, {
                $pull: { posted: verdict.id }
            });
            res.status(200).json({
                msg: "Successfully Deleted"
            });
        } catch (err) {
            res.status(500).json({
                msg: `Server Error :${err}`
            });
        }

    };

    //post of following account
    async following(req, res) {
        try {
            const UserObject = await User.findById(req.user.id);
            const verdict = await Post.find({ user: UserObject.following });
            if (!verdict) {
                return res.status(400).json({
                    msg: "Some Error in loading your verdicts"
                });
            }
            res.status(200).json({ 
                verdict: verdict 
            });
        } catch (err) {
            res.status(500).json({
                msg: `Server Error :${err}`
            });
        }
    };

    //like a posts
    async like(req, res) {
        try {
            const UserObject = await User.findById(req.user.id);
            const VerdictObject = await Post.findById(req.query.id);
            if (!UserObject.liked.includes(req.query.id)) {
                await UserObject.updateOne({ $push: { liked: req.query.id } });
                await VerdictObject.updateOne({ $push: { like: req.user.id } });

                res.status(200).json({
                    msg: "Post Liked"
                });
            } else {
                await UserObject.updateOne({ $pull: { liked: req.query.id } });
                await VerdictObject.updateOne({ $pull: { like: req.user.id } });
                res.status(200).json({
                    msg: "Post like removed"
                });
            }
        } catch (err) {
            res.status(500).json({
                msg: `Server Error :${err}`
            });
        }
    };
}
module.exports = new postHandler();