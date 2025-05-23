// const express = require("express");
import express from "express";
import { getFeaturedProducts, getNewProducts, getProductList } from "../handler/product-handler.js";
import { addWishlist, getWishlist, removeFromWishlist } from "../handler/wishlist-handler.js";
import { addProductCart, removeFromCart, getCartItems } from "../handler/shopping-cart-handler.js";
// const { getFeaturedProducts, getNewProducts, getproductList } = require("../handler/product-handler");
// const { addWishlist, getWishlist, removeFromWishlist } = require("../handler/wishlist-handler")
// const { addProductCart, removeFromCart, getCartItems } = require("../handler/shopping-cart-handler")
const router = express.Router();
router.get("/new-products", getNewProducts)
router.get("/featured-products", getFeaturedProducts);
router.get("", getProductList)
router.get("/wishlist", getWishlist)
router.post("/wishlist/:id", addWishlist)
router.delete("/wishlist/:id", removeFromWishlist)
router.get("/cart", getCartItems)
router.post("/cart/:id", addProductCart)
router.delete("/cart/:id", removeFromCart)
// module.exports = router;
export default router;