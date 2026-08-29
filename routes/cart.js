const express = require('express');
const router  = express.Router();

const cartController = require('../controllers/cartController');
const { protect }    = require('../middleware/auth');

// All cart routes require authentication
router.use(protect);

router.get('/',                 cartController.getCart);
router.post('/items',           cartController.addItem);
router.put('/items/:itemId',    cartController.updateItem);
router.delete('/items/:itemId', cartController.removeItem);
router.delete('/',              cartController.clearCart);

module.exports = router;
