const { Router } = require('express');
const { check } = require('express-validator');
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('../controllers/products');
const { productExists, categoryExists } = require('../helpers/db-validators');

const { validateFields, validateJWT, isAdminRole } = require('../middlewares');

const router = Router();

/**
 * {{url}}/api/products
 */

// Get all products - public
router.get('/', getProducts)

// Get product by id - public
router.get('/:id', [
    check('id', 'Not a valid id').isMongoId(),
    check('id').custom(productExists),
    validateFields
], getProduct)

// Create product - private - any role
router.post('/', [
    validateJWT,
    check('name', 'Name is required').notEmpty(),
    // validate category
    check('category', 'Category is required').notEmpty(),
    check('category', 'Not a valid id').isMongoId(),
    check('category').custom(categoryExists),
    validateFields
], createProduct)

// Update product - private - any role
router.put('/:id', [
    validateJWT,
    check('id', 'Not a valid id').isMongoId(),
    check('id').custom(productExists),
    check('category', 'Not a valid id').optional().isMongoId(),
    check('category').optional().custom(categoryExists),
    validateFields
], updateProduct)

// Delete product - private - admin
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'Not a valid id').isMongoId(),
    check('id').custom(productExists),
    validateFields
], deleteProduct)

module.exports = router;
