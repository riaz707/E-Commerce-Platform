const express = require('express');
const { body } = require('express-validator');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus,
  getAllOrders,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');
const validateRequest = require('../middleware/validate');

const router = express.Router();

router.use(protect); // every order route requires a logged-in user

router.post(
  '/',
  [
    body('shippingAddress.street').notEmpty().withMessage('Street is required'),
    body('shippingAddress.city').notEmpty().withMessage('City is required'),
    body('shippingAddress.postalCode').notEmpty().withMessage('Postal code is required'),
    body('shippingAddress.country').notEmpty().withMessage('Country is required'),
    body('paymentMethod').notEmpty().withMessage('Payment method is required'),
  ],
  validateRequest,
  createOrder
);

router.get('/myorders', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/pay', updateOrderToPaid);

// Admin-only routes
router.get('/', admin, getAllOrders);
router.put('/:id/deliver', admin, updateOrderToDelivered);
router.put('/:id/status', admin, updateOrderStatus);

module.exports = router;
