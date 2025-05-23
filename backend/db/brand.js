// const mongoose = require("mongoose");
import mongoose from "mongoose";
const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    }
})
const Brand = mongoose.model("Brand", brandSchema);
export default Brand;
