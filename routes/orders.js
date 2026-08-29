const express  = require('express');
const { body } = require('express-validator');
const router   = express.Router();

const orderController        = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

const orderValidation = [
  body('shippingAddress').trim().notEmpty().withMessage('Shipping address is required.'),
];

// User routes
router.post('/',   protect, orderValidation, orderController.createOrder);
router.get('/',    protect,                  orderController.getMyOrders);
router.get('/admin/all', protect, adminOnly, orderController.getAllOrders);
router.get('/:id', protect,                  orderController.getOrder);

// Admin route to update order status
router.patch('/:id/status', protect, adminOnly, orderController.updateStatus);

module.exports = router;
