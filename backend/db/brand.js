// const mongoose = require("mongoose");
import mongoose from "mongoose";
const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
})
const Brand = mongoose.model("Brand", brandSchema);
export default Brand;
