import Order from './../db/order';
const addorder = async (req, res) => {
    let userId = req.user.id;
    let orderdetails = req.body;
    let order = new Order({
        ...orderdetails,
        userId,
    });
    await Order.save();
}
const getorder = async (req, res) => {
    let orders = await Order.find({ userId });
    return orders.toObject();
}

export { addorder, getorder }

