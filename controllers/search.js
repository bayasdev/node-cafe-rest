const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { User, Category, Product } = require('../models');

const allowedCollections = [
    'users',
    'categories',
    'products',
    'roles'
];

const searchUsers = async (term = '', res = response) => {
    const isMongoId = ObjectId.isValid(term);

    if (isMongoId) {
        const user = await User.findById(term);
        return res.json({
            results: (user) ? [user] : []
        });
    }

    const regex = new RegExp(term, 'i');

    const users = await User.find({
        $or: [{ name: regex }, { email: regex }],
        $and: [{ status: true }]
    });

    res.json({
        results: (users) ? [users] : []
    });
}

const searchCategories = async (term = '', res = response) => {
    const isMongoId = ObjectId.isValid(term);

    if (isMongoId) {
        const result = await Category.findById(term);
        return res.json({
            results: (result) ? [result] : []
        });
    }

    const regex = new RegExp(term, 'i');

    const results = await Category.find({ name: regex, status: true });

    res.json({
        results: (results) ? [results] : []
    });
}

const searchProducts = async (term = '', res = response) => {
    const isMongoId = ObjectId.isValid(term);

    if (isMongoId) {
        const result = await Product.findById(term).populate('category', 'name');
        return res.json({
            results: (result) ? [result] : []
        });
    }

    const regex = new RegExp(term, 'i');

    const results = await Product.find({
        $or: [{ name: regex }, { description: regex }],
        $and: [{ status: true }]
    }).populate('category', 'name');

    res.json({
        results: (results) ? [results] : []
    });
}

const search = (req, res = response) => {
    const { collection, term } = req.params;

    if (!allowedCollections.includes(collection)) {
        return res.status(400).json({
            msg: `Allowed collections: ${allowedCollections}`
        })
    }

    switch (collection) {
        case 'users':
            searchUsers(term, res);
            break;
        case 'categories':
            searchCategories(term, res);
            break;
        case 'products':
            searchProducts(term, res);
            break;
        default:
            res.status(500).json({
                msg: 'Fix this search'
            })
    }
}

module.exports = {
    search,
}
