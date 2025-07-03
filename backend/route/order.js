import express from "express";
const router = express.Router();
import { addorder, getAllOrders, getcustomerorders, deleteOrder, changeOrderStatus } from "../handler/order-handler.js";
router.post('/addorder', addorder)
router.get('/orders', getcustomerorders)
router.get('/allorders', getAllOrders)
router.delete('/delete/:orderId', deleteOrder)
router.put('/status', changeOrderStatus)
export default router;