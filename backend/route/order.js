import express from "express";
const router = express.Router();
import { addorder, getAllOrders, getcustomerorders, deleteOrder } from "../handler/order-handler.js";
router.post('/addorder', addorder)
router.get('/orders', getcustomerorders)
router.get('/allorders', getAllOrders)
router.delete('/delete/:orderId', deleteOrder)
export default router;