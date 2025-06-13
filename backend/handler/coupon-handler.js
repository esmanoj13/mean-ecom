import Coupon from '../db/coupon.js';

// Create a new coupon
export const createCoupon = async (req, res) => {
    try {
        const coupon = new Coupon(req.body);
        await coupon.save();
        res.status(201).json({
            success: true,
            message: 'Coupon created successfully',
            coupon
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Validate coupon
export const validateCoupon = async (req, res) => {
    try {
        const { code, cartTotal } = req.body;
        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            isActive: true
        });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Invalid coupon code'
            });
        }

        if (coupon.expiresAt && coupon.expiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Coupon has expired'
            });
        }

        if (cartTotal < coupon.minPurchase) {
            return res.status(400).json({
                success: false,
                message: `Minimum purchase amount of ${coupon.minPurchase} required`
            });
        }

        let discountAmount;
        if (coupon.discountType === 'percentage') {
            discountAmount = (cartTotal * coupon.value) / 100;
            if (coupon.maxDiscount) {
                discountAmount = Math.min(discountAmount, coupon.maxDiscount);
            }
        } else {
            discountAmount = coupon.value;
        }

        res.json({
            success: true,
            message: 'Coupon applied successfully',
            coupon: {
                code: coupon.code,
                type: coupon.discountType,
                value: coupon.value,
                discountAmount
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// List all coupons (admin only)
export const listCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.json({
            success: true,
            coupons
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete coupon (admin only)
export const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }
        res.json({
            success: true,
            message: 'Coupon deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update coupon (admin only)
export const updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }
        res.json({
            success: true,
            message: 'Coupon updated successfully',
            coupon
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
