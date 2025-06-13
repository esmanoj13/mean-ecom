import mongoose from "mongoose";
const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    expiresAt: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    minPurchase: {
        type: Number,
        default: 0
    },
    maxDiscount: {
        type: Number
    }
});

export default mongoose.model('Coupon', couponSchema);