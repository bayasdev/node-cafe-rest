const { Router } = require('express');
const { check } = require('express-validator');
const { getUsers, updateUser, createUser, deleteUser, patchUser } = require('../controllers/users');
const { isRoleValid, emailExists, userByIdExists } = require('../helpers/db-validators');

// const { validateFields } = require('../middlewares/validate-fields');
// const { validateJWT } = require('../middlewares/validate-jwt');
// const { isAdminRole, hasRole } = require('../middlewares/validate-roles');

const { validateFields, validateJWT, isAdminRole, hasRole } = require('../middlewares');

const router = Router();

// Get all users - admin
router.get('/', [
    validateJWT,
    isAdminRole
], getUsers);

// Create user - public
router.post('/', [
    check('name', 'Name is required').notEmpty(),
    check('password', 'Password must have 6 characters').isLength({ min: 6 }),
    check('email', 'Email is not valid').isEmail(),
    check('email').custom(emailExists),
    check('role').custom(isRoleValid),
    validateFields
], createUser);

// Update user by id - admin
router.put('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'Not a valid id').isMongoId(),
    check('id').custom(userByIdExists),
    check('role').custom(isRoleValid),
    validateFields
], updateUser);

// Delete user by id - admin
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    // hasRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'Not a valid id').isMongoId(),
    check('id').custom(userByIdExists),
    validateFields
], deleteUser);

module.exports = router;
