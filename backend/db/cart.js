// const mongoose = require("mongoose");
import mongoose from "mongoose";
// const productSchema = new mongoose.Schema({
const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        validate: {
            validator: Number.isInteger,
            message: "{VALUE} is not a valid integer."
        }
    },
    price: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }

});
// const cartSchema = new mongoose.Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true
//     },
//     Products: [productSchema],
//     totalPrice: {
//         type: Number,
//         default: 0
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     updatedAt: {
//         type: Date,
//         default: Date.now
//     }
// });
// cartSchema.pre('save', function (next) {
//     this.totalPrice = this.products.reduce((total, product) => {
//         return total + (product.price * product.quantity)
//     }, 0);
//     this.updateAt = Date.now();
//     next();
// });
const Cart = mongoose.model("Cart", cartSchema);
export default Cart;