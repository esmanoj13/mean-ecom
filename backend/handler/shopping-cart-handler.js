// const Cart = require("../db/cart.js")
import Cart from "../db/cart.js"
const addProductCart = async (req, res) => {
    const userId = req.user.id;
    const productId = req.params.id;
    let { quantity } = req.body
    console.log("userId:" + userId, "productId:" + productId, "quantity:" + quantity)
    try {
        quantity = parseInt(quantity, 10);
        if (isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({ message: "Invalid quantity. Must be a positive number." });
        }
        let product = await Cart.findOne({ userId, productId });
        if (product) {
            product.quantity += quantity;
        }
        else {
            product = new Cart({
                userId,
                productId,
                quantity,
            })
        }
        await product.save();
        return res.status(201).send(product.toObject());
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while adding to the cart", error });
    }
}

const removeFromCart = async (req, res) => {
    const userId = req.user.id;
    const productId = req.params.id;
    try {
        let product = Cart.findOneAndDelete({ userId, productId })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while removing into the cart", error });
    }
}
const getCartItems = async (req, res) => {
    const userId = req.user.id;
    try {
        let products = await Cart.find({ userId }).populate('productId')
        if (!products) {
            return res.status(404).json({ error: "product not found" })
        }
        products = products.map((x) => {
            return { quantity: x.quantity, productId: x.toObject().productId }
        });
        return res.status(200).json(products)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while getting cart", error });
    }
}

export { addProductCart, removeFromCart, getCartItems }