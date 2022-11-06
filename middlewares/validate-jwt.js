const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            msg: 'Unauthorized'
        });
    }
    try {
        const { uid } = jwt.verify(token, process.env.SECRET);
        // gather user from DB
        const user = await User.findById(uid);
        if (!user) {
            return res.status(401).json({
                msg: 'Invalid token'
            });
        }
        // check if user is active
        if (!user.status) {
            return res.status(401).json({
                msg: 'Invalid token'
            });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: 'Invalid token'
        });
    }
};

module.exports = {
    validateJWT
}
