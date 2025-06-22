// const Cart = require("../db/cart.js")
import Cart from "../db/cart.js";
import Product from "../db/product.js";
const addProductCart = async (req, res) => {
    const userId = req.user.id;
    const productId = req.params.id;
    let { quantity } = req.body;
    const productData = await Product.findById(productId);
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
                price: productData.price
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
        let product = await Cart.findOneAndDelete({ userId, productId });
        if (!product) {
            return res.status(404).json({ error: "product not found" })
        }
        return res.status(200).json({ message: "Product removed from cart successfully" });
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

// update the cart when clicking on the inc/dec button in the cart page
const updateCart = async (req, res) => {
    const userId = req.user.id;
    const productId = req.params.id;
    const { quantity } = req.body;
    if (!productId || quantity == null) {
        return res.status(400).json({ message: 'Product ID and quantity are required' });
    }
    try {
        let cart = await Cart.findOne({ userId, productId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        if (quantity <= 0) {
            // If quantity is 0 or less, remove the product from the cart
            await Cart.deleteOne({ userId, productId });
            return res.status(200).json({ message: 'Product removed from cart' });
        } else {
            // Update the quantity of the product in the cart
            cart.quantity = quantity;
            await cart.save();
            return res.status(200).json({ message: 'Cart updated successfully', cart });
        }
    }
    catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export { addProductCart, removeFromCart, getCartItems, updateCart };