// const Wishlist = require("./../db/wishlist");
import Wishlist from "./../db/wishlist.js"
const addWishlist = async (req, res) => {
    try {
        const userId = req.user?.id;
        const productId = req.params.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        const existingWishlist = await Wishlist.findOne({ userId, productId });
        if (existingWishlist) {
            return res.status(400).json({ message: "Product is already in the wishlist" });
        }
        let wishlist = new Wishlist({
            userId,
            productId,
        })
        await wishlist.save();
        wishlist = wishlist.toObject();
        return res.status(201).json({ message: "Wishlist added successfully", wishlist });


    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while adding to the wishlist", error });
    }
}
const getWishlist = async (req, res) => {
    const userId = req.user.id;
    try {
        let wishlist = await Wishlist.find({ userId: userId }).populate("productId");
        wishlist = wishlist.map(x =>
            x.toObject().productId
        )
        if (!wishlist) {
            return res.status(404).json({ error: "Wishlist not found." });
        }
        res.status(200).json(wishlist);
    } catch (err) {
        console.error("Error fetching wishlist product:", err);
        return res.status(500).json({
            error: "An error occurred to find the wishlist product"
        })
    }
}
const removeFromWishlist = async (req, res) => {
    try {
        const productId = req.params.id
        const userId = req.user.id;
        const wishlist = await Wishlist.findOneAndDelete({
            userId: userId,
            productId: productId
        });
        if (!wishlist) {
            return res.status(404).json({ error: "Product is not removed from Wishlist." });
        }
        return res.status(200).json({ message: "Product is removed" });
    } catch (err) {
        console.error("Error fetching wishlist product:", err);
        return res.status(500).json({
            error: "An error occurred remove the product"
        })
    }
}

export { addWishlist, getWishlist, removeFromWishlist }