import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// const express = require('express');
// const cors = require("cors");
// const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;
const apiUrl = process.env.API_URL;

app.use(express.json());

// const categoryRoutes = require("./route/category");
// const brandRoutes = require("./route/brand");
// const productRoutes = require("./route/product")
// const customerRoutes = require("./route/customer")
// const userRoutes = require("./route/user");

// const { verifyToken, isAdmin } = require('./Middleware/auth.middleware');
app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
import categoryRoutes from "./route/category.js";
import brandRoutes from "./route/brand.js";
import productRoutes from "./route/product.js";
import customerRoutes from "./route/customer.js";
import userRoutes from "./route/user.js";
import couponRoutes from "./route/coupon.js";
import orderRoutes from "./route/order.js";

import { verifyToken, isAdmin } from './Middleware/auth.middleware.js';
connectdB();
async function connectdB() {
    try {
        console.log("Connecting to the database...")
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connected to MongoDB successfully!');
    } catch (err) {
        console.error('Database connection error:', err);
    }
}
console.log('The API URL is:', apiUrl);
app.get('/', (req, res) => {
    res.send(`API URL is: ${apiUrl}`);
});
app.use("/auth", userRoutes);
app.use("/api/coupons", couponRoutes);
// app.use("/category", verifyToken, categoryRoutes);
// app.use("/brand", verifyToken, isAdmin, brandRoutes);
// app.use("/product", verifyToken, isAdmin, productRoutes);
app.use("/category", categoryRoutes);
app.use("/brand", brandRoutes);
app.use("/product", productRoutes);
app.use("/customer", verifyToken, customerRoutes);
app.use('/images', express.static('public/images'));
app.use('/order', verifyToken, orderRoutes);

// app.use("/category", categoryRoutes);
// app.use("/brand", brandRoutes);
// app.use("/product", productRoutes);
// app.use("/customer", customerRoutes);
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});



