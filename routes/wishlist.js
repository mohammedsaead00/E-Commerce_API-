const express = require('express');
const router  = express.Router();

const wishlistController = require('../controllers/wishlistController');
const { protect }        = require('../middleware/auth');

// All wishlist routes require authentication
router.use(protect);

router.get('/',              wishlistController.getWishlist);
router.post('/',             wishlistController.addItem);
router.delete('/',           wishlistController.clearWishlist);
router.delete('/:productId', wishlistController.removeItem);

module.exports = router;
