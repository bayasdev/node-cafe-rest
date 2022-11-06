const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const getUsers = async (req = request, res) => {
    const { limit = 5, from = 0 } = req.query;
    const query = { status: true }

    // wait for queries
    const [total, users] = await Promise.all([
        User.countDocuments(query),
        await User.find(query)
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.json({
        total,
        users
    })
}

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { _id, password, google, email, ...resto } = req.body;
    if (password) {
        // hash pw
        const salt = bcrypt.genSaltSync(10);
        resto.password = bcrypt.hashSync(password, salt);
    }

    const dbUser = await User.findByIdAndUpdate(id, resto)

    res.json({
        dbUser
    })
}

const createUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });

    // hash pw
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(password, salt);

    // save
    await user.save();

    res.status(201).json({
        user
    })
}

const deleteUser = async (req, res) => {
    const { id } = req.params;

    // delete from DB
    // const user = await User.findByIdAndDelete(id);

    // soft delete
    const user = await User.findByIdAndUpdate(id, { status: false })
    const authenticatedUser = req.user;

    res.json({
        user,
        authenticatedUser
    })
}

module.exports = {
    getUsers,
    updateUser,
    createUser,
    deleteUser
}
