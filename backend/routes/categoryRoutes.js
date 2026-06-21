const express = require('express');
const { body } = require('express-validator');
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/auth');
const validateRequest = require('../middleware/validate');

const router = express.Router();

router.get('/', getCategories);
router.get('/:id', getCategoryById);

router.post(
  '/',
  protect,
  admin,
  [body('name').trim().notEmpty().withMessage('Category name is required')],
  validateRequest,
  createCategory
);
router.put('/:id', protect, admin, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

module.exports = router;
