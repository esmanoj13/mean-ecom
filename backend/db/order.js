// const mongoose = require("mongoose");
import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    items: [{
        type: mongoose.Schema.Types.Mixed,
        required: true
    }],
    address: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    paymentType: {
        type: string,
        required: true
    },
    status: {
        type: string,
        required: true,
    },
    date: {
        type: Date
    }
});
const Order = mongoose.model("Order", orderSchema);
export default Order;