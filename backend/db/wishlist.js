// const mongoose = require("mongoose");
import mongoose from "mongoose";
const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
    productId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }
})
const WishList = mongoose.model("WishList", wishlistSchema);
export default WishList;