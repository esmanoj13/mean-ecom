// const express = require("express");
import express from "express";
const router = express.Router();
import { getCategory, addCategory, updateCategory, deleteCategory, getCategories  } from "../handler/category-handler.js";
// const { getCategory, addCategory, updateCategory, deleteCategory, getCategories } = require("../handler/category-handler")
router.get("", getCategories);
router.post("", addCategory);
router.get("/:id", getCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory)
// module.exports = router;
export default router;
