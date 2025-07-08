// const express = require("express");
import express from "express";
const router = express.Router();
import { getbrands, addBrands, deleteBrand, updateBrand, editBrand } from "../handler/brand-handler.js";
// const { getbrands, addBrands, deleteBrand, updateBrand, getBrand } = require("../handler/brand-handler");
router.get("", getbrands);
router.post("", addBrands);
router.get("/:id", editBrand);
router.put("/:id", updateBrand);
router.delete("/:id", deleteBrand)
// module.exports = router;
export default router;
