const { Router } = require('express');
const { check } = require('express-validator');
const { loadFile, updateImage, getImage } = require('../controllers/uploads');
const { allowedCollections } = require('../helpers');
const { validateFields, validateFile } = require('../middlewares');

const router = Router();

router.post('/', validateFile, loadFile);

router.put('/:collection/:id', [
    validateFile,
    check('id', 'Not a valid id').isMongoId(),
    check('collection').custom(c => allowedCollections(c, ['users', 'products'])),
    validateFields
], updateImage)

router.get('/:collection/:id', [
    check('id', 'Not a valid id').isMongoId(),
    check('collection').custom(c => allowedCollections(c, ['users', 'products'])),
    validateFields
], getImage);

module.exports = router;
