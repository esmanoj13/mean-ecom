// const express = require("express");
import express from "express";
const router = express.Router();
import { addProduct, getProducts, getProduct, updateProduct, deleteProduct } from "../handler/product-handler.js";
// const { addProduct, getProducts, getProduct, updateProduct, deleteProduct } = require("../handler/product-handler")
router.get("", getProducts);
router.post("", addProduct);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct)
// module.exports = router;
export default router;