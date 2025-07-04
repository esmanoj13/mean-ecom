import Order from './../db/order.js';
const addorder = async (req, res) => {
    try {
        let userId = req.user.id;
        let orderdetails = req.body;
        let order = new Order({
            ...orderdetails,
            userId,
        });
        const savedOrder = await order.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(500).json({ message: 'Failed to add order', error: err.message });
    }
}
const getcustomerorders = async (req, res) => {
    try {
        const userId = req.user.id;
        let orders = await Order.find({ userId: req.user.id }).sort({ orderDate: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch order', error: err.message });
    }
}
const getAllOrders = async (req, res) => {
    try {
        let orders = await Order.find().sort({ orderDate: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch all orders', error: err.message });
    }
}
const deleteOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const orderId = req.params.id;
        const order = await Order.findOneAndDelete({ _id: orderId, userId });
        if (!order) {
            return res.status(404).json({ message: "Order not found or not authorized" });
        }
        res.status(200).json({ message: "Order deleted successfully", order });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete order", error: err.message });
    }
}
const changeOrderStatus = async (req, res) => {
    try {
        const { id: orderId, status } = req.body;
        if (!orderId || !status) {
            return res.status(400).json({ message: "Order ID and status are required." });
        }
        const allowedStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value." });
        }
        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ message: "Failed to update order status", error: err.message });
    }
}

export { addorder, getAllOrders, getcustomerorders, deleteOrder, changeOrderStatus }