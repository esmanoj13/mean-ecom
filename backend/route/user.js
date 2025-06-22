// const express = require("express");
import express from "express";
const router = express.Router();
import { userregister, userlogin, userResetPassword, userForgotPassword } from "../handler/auth-handler.js";
// const { userregister, userlogin } = require("../handler/auth-handler");
router.post("/register", userregister);
router.post("/login", userlogin);
router.post("/forgot-password", userForgotPassword);
router.post("/reset-password", userResetPassword);



export default router;


