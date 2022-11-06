const { Router } = require('express');
const { check } = require('express-validator');
const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/categories');
const { categoryExists } = require('../helpers/db-validators');

const { validateFields, validateJWT, isAdminRole } = require('../middlewares');

const router = Router();

/**
 * {{url}}/api/categories
 */

// Get all categories - public
router.get('/', getCategories)

// Get category by id - public
router.get('/:id', [
    check('id', 'Not a valid id').isMongoId(),
    check('id').custom(categoryExists),
    validateFields
], getCategory)

// Create category - private - any role
router.post('/', [
    validateJWT,
    check('name', 'Name is required').notEmpty(),
    validateFields
], createCategory)

// Update category - private - any role
router.put('/:id', [
    validateJWT,
    check('name', 'Name is required').notEmpty(),
    check('id', 'Not a valid id').isMongoId(),
    check('id').custom(categoryExists),
    validateFields
], updateCategory)

// Delete category - private - admin
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'Not a valid id').isMongoId(),
    check('id').custom(categoryExists),
    validateFields
], deleteCategory)

module.exports = router;
