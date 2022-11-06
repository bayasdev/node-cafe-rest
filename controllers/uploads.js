const path = require('path');
const fs = require('fs');

const { response } = require("express");
const { uploadFile } = require("../helpers");

const { User, Product } = require('../models')

const loadFile = async (req, res = response) => {
    try {
        // txt, md
        // const name = await uploadFile(req.files, ['txt', 'md'], 'texts');
        const name = await uploadFile(req.files, undefined, 'images');
        res.json({
            name
        });
    } catch (error) {
        res.status(400).json({
            msg: error
        });
    }
}

const updateImage = async (req, res = response) => {
    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({ msg: `User ${id} does not exist` });
            }
            break;

        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({ msg: `Product ${id} does not exist` });
            }
            break;

        default:
            res.status(500).json({ msg: 'Fix this!' });
            break;
    }

    try {
        // Upload new image
        const newImg = await uploadFile(req.files, undefined, collection);

        // Clean up previous image
        if (model.img) {
            // Delete image from server
            const imagePath = path.join(__dirname, '../uploads', collection, model.img);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // Update
        model.img = newImg;

        // Save
        await model.save();

        res.json(model);
    } catch (error) {
        res.status(400).json({
            msg: error
        });
    }
}

const getImage = async (req, res = response) => {
    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({ msg: `User ${id} does not exist` });
            }
            break;

        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({ msg: `Product ${id} does not exist` });
            }
            break;

        default:
            res.status(500).json({ msg: 'Fix this!' });
            break;
    }

    if (model.img) {
        const imagePath = path.join(__dirname, '../uploads', collection, model.img);
        if (fs.existsSync(imagePath)) {
            return res.sendFile(imagePath)
        }
    }

    res.sendFile(path.join(__dirname, '../assets/no-image.jpg'));
}

module.exports = {
    loadFile,
    updateImage,
    getImage
}
