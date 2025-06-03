// const express = require("express");
import express from "express";
import { addWishlist, getWishlist, removeFromWishlist } from "../handler/wishlist-handler.js";
import { addProductCart, removeFromCart, getCartItems, updateCart } from "../handler/shopping-cart-handler.js";
// const { getFeaturedProducts, getNewProducts, getproductList } = require("../handler/product-handler");
// const { addWishlist, getWishlist, removeFromWishlist } = require("../handler/wishlist-handler")
// const { addProductCart, removeFromCart, getCartItems } = require("../handler/shopping-cart-handler")
const router = express.Router();
router.get("/wishlist", getWishlist)
router.post("/wishlist/:id", addWishlist)
router.delete("/wishlist/:id", removeFromWishlist)
router.get("/cart", getCartItems)
router.post("/cart/:id", addProductCart)
router.delete("/cart/:id", removeFromCart)
router.put("/cart/:id", updateCart);
// module.exports = router;
export default router;