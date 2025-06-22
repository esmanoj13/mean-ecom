// const mongoose = require("mongoose");
import mongoose from "mongoose";
const addressSchema = new mongoose.Schema({
    address1: {
        type: String,
        required: true,
    },
    address2: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    pincode: {
        type: Number,
        required: true,
    },
    contact: {
        type: Number,
        required: true,
    }
}, { timestamp: true });
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    address: [addressSchema],
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: [/.+@.+\..+/, "Plese enter correct format"],
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    isAdmin: {
        type: Boolean
    }
})
const User = mongoose.model('User', userSchema);
export default User;