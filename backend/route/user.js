// const express = require("express");
import express from "express";
const router = express.Router();
import { userregister, userlogin } from "../handler/auth-handler.js";
// const { userregister, userlogin } = require("../handler/auth-handler");
router.post("/register", userregister);
router.post("/login", userlogin);

export default router;


