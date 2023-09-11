const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken");

class AuthHandler {

    async register(req, res) {
        
        try {
            const { username, email, password } = req.body;

            let user_email_exist = await User.findOne({ email: email });
            let username_exist = await User.findOne({ username: username });
            if (user_email_exist) {
                res.status(409).json({
                    msg: 'User already exist'
                });
            } else if (username_exist) {
                res.status(409).json({
                    msg: 'Username not available'
                });
            } else {
                let user = new User();

                user.name = username;
                user.username = username;
                user.email = email;

                const salt = await bcryptjs.genSalt(10);
                user.password = await bcryptjs.hash(password, salt);

                await user.save();
                const payload = {
                    user: {
                        id: user.id
                    }
                }
                jwt.sign(payload, process.env.jwtUserSecret, {
                    expiresIn: 30000
                }, (err, token) => {
                    if (err) throw err;
                    res.status(201).json({
                        token: token
                    });
                })
            }
        } catch (err) {

            res.status(500).json({
                msg: `Server Error: ${err}`
            })
        }
    };


    async login(request, response){
        try {
            const id = request.body.id;
            const password = request.body.password;
        
            let user = await User.findOne({ $or: [{ email: id }, { username: id }] })

            if (!user) {
                response.status(404).json({
                    msg: 'User does not exist, Resister to continue!'
                });
            }
            const isMatch = await bcryptjs.compare(password, user.password);
            if (!isMatch) {
                return response.status(401).json({
                    msg: 'Inavalid Credentials'
                })
            }
            const payload = {
                user: {
                    id: user.id
                }
            }
            jwt.sign(payload, process.env.jwtUserSecret, {
                expiresIn: 300000
            }, (err, token) => {
                if (err) throw err;
                
                response.status(200).json({
                    token: token
                });
            })
        } catch (err) {
            
            response.status(500).json({
                msg: `Server Error: ${err}`
            })
        }
    };
}

module.exports = new AuthHandler();