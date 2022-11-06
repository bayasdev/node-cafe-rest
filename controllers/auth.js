const bcrypt = require("bcryptjs");
const { response, json } = require("express");
const { generateJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-verify");
const User = require('../models/user')

const login = async (req, res = response) => {
    const { email, password } = req.body;

    try {
        // check if email exists
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                msg: 'Email or password is incorrect'
            })
        }

        // check if active
        if (!user.status) {
            return res.status(400).json({
                msg: 'Your account has been disabled'
            })
        }

        // check PW
        const validPassword = bcrypt.compareSync(password, user.password)
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Email or password is incorrect'
            })
        }

        // generate JWT
        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'An error ocurred',
        })
    }
}

const googleSignIn = async (req, res = response) => {
    const { id_token } = req.body;

    try {
        const { name, email, img } = await googleVerify(id_token);

        let user = await User.findOne({ email });

        if (!user) {
            // we need to create the user
            const data = {
                name,
                email,
                password: ':P',
                img,
                role: 'USER_ROLE',
                google: true
            };

            user = new User(data);
            await user.save();
        }

        // If user it's already in DB
        if (!user.status) {
            return res.status(401).json({
                msg: 'Your account has been disabled. Contact Administrator'
            });
        }

        // generate JWT
        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        });
    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Cannot verify Google Token'
        })
    }
}

module.exports = {
    login,
    googleSignIn
}
