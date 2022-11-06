const { Category, Role, User, Product } = require('../models');
const { collection } = require('../models/category');

const isRoleValid = async (role = '') => {
    const roleExists = await Role.findOne({ role });
    if (!roleExists) {
        throw new Error(`Role ${role} is not registered`);
    }
}

const emailExists = async (email = '') => {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
        throw new Error(`Email ${email} is already registered`);
    }
}

const userByIdExists = async (id) => {
    const userExists = await User.findById(id);
    if (!userExists) {
        throw new Error(`User ${id} does not exist`);
    }
}

const categoryExists = async (id) => {
    const exists = await Category.findById(id);
    if (!exists) {
        throw new Error(`Id ${id} does not exist`);
    }
}

const productExists = async (id) => {
    const exists = await Product.findById(id);
    if (!exists) {
        throw new Error(`Id ${id} does not exist`);
    }
}

const allowedCollections = async (collection = '', collections = []) => {
    const isIncluded = collections.includes(collection);
    if (!isIncluded) {
        throw new Error(`Collection ${collection} is not allowed`);
    }

    return true;
}

module.exports = {
    isRoleValid,
    emailExists,
    userByIdExists,
    categoryExists,
    productExists,
    allowedCollections
}
