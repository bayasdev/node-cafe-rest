const { response } = require("express");
const { Product } = require('../models')

const getProducts = async (req, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const query = { status: true }

    const [total, categories] = await Promise.all([
        Product.countDocuments(query),
        await Product.find(query)
            .populate('user', 'name')
            .populate('category', 'name')
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.json({
        total,
        categories
    })
}

const getProduct = async (req, res = response) => {
    const { id } = req.params;
    const product = await Product.findById(id)
        .populate('user', 'name')
        .populate('category', 'name');

    res.json(product);
}

const createProduct = async (req, res = response) => {
    const data = req.body;
    data.name = data.name.toUpperCase();
    const productDB = await Product.findOne({ name: data.name });

    if (productDB) {
        return res.status(400).json({
            msg: `Product ${productDB.name} already exists!`
        });
    }

    data.user = req.user._id;

    const product = new Product(data);

    await product.save();

    res.status(201).json(product);
}

const updateProduct = async (req, res = response) => {
    const { id } = req.params;
    const { status, user, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    res.json(product);
}

const deleteProduct = async (req, res = response) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { status: false }, { new: true });

    res.json(product);
}


module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
}
