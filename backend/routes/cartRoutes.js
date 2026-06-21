const express = require('express');
const { body } = require('express-validator');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');
const validateRequest = require('../middleware/validate');

const router = express.Router();

router.use(protect); // every cart route requires a logged-in user

router.get('/', getCart);
router.post(
  '/',
  [
    body('productId').isMongoId().withMessage('A valid productId is required'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  ],
  validateRequest,
  addToCart
);
router.put('/:productId', updateCartItem);
router.delete('/:productId', removeCartItem);
router.delete('/', clearCart);

module.exports = router;
