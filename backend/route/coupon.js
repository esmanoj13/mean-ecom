import express from 'express';
import { createCoupon, validateCoupon, listCoupons, deleteCoupon, updateCoupon } from '../handler/coupon-handler.js';
import { verifyToken as authenticateToken, isAdmin } from '../Middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/validate', authenticateToken, validateCoupon);

// Admin routes
router.post('/', authenticateToken, isAdmin, createCoupon);
router.get('/', authenticateToken, isAdmin, listCoupons);
router.put('/:id', authenticateToken, isAdmin, updateCoupon);
router.delete('/:id', authenticateToken, isAdmin, deleteCoupon);

export default router;
