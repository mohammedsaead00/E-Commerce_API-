const express  = require('express');
const { body } = require('express-validator');
const router   = express.Router();

const categoryController = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middleware/auth');

const categoryValidation = [
  body('name').trim().notEmpty().withMessage('Category name is required.'),
];

router.get('/',     categoryController.getAll);
router.get('/:id',  categoryController.getOne);
router.post('/',    protect, adminOnly, categoryValidation, categoryController.create);
router.put('/:id',  protect, adminOnly, categoryValidation, categoryController.update);
router.delete('/:id', protect, adminOnly, categoryController.remove);

module.exports = router;
