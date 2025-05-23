// const mongoose = require("mongoose");
import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
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