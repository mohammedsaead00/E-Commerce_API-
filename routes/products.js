const express  = require('express');
const { body } = require('express-validator');
const router   = express.Router();

const productController      = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');

const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required.'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number.'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer.'),
  body('categoryId').isInt().withMessage('categoryId must be an integer.'),
];

router.get('/',       productController.getAll);
router.get('/:id',    productController.getOne);
router.post('/',      protect, adminOnly, productValidation, productController.create);
router.put('/:id',    protect, adminOnly, productController.update);
router.delete('/:id', protect, adminOnly, productController.remove);

module.exports = router;
