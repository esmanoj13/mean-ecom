// const express = require("express");
import express from "express";
const router = express.Router();
import { addProduct, getProducts, getProduct, updateProduct, deleteProduct, getFeaturedProducts, getNewProducts, getProductList } from "../handler/product-handler.js";
import upload from '../Middleware/multerConfig.js';
// const { addProduct, getProducts, getProduct, updateProduct, deleteProduct } = require("../handler/product-handler")
router.get("/new-products", getNewProducts)
router.get("/featured-products", getFeaturedProducts);
router.get("", getProductList)
router.get("", getProducts);
// router.post("", addProduct);
router.post("/", upload.array("images", 10), addProduct);
router.get("/:id", getProduct);
// router.put("/:id", updateProduct);
router.put("/:id", upload.array('images'), updateProduct);
router.delete("/:id", deleteProduct)
// module.exports = router;
export default router;