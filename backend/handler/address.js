import dotenv from 'dotenv';
dotenv.config();
import User from "../db/user.js";
const getAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user.address);     
    } catch (err) {
        res.status(500).json({
            message: 'server error'
        })
    }
}

const addUserAddress = async (req, res) => {
    try {
        const newAddress = req.body;
        const user = await User.findById(req.user.id);
        user.address.push(newAddress);
        await user.save()
        res.status(201).json(user.address);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
}

const deleteUserAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.address = user.address.filter(addr => addr._id.toString() !== req.params.id);
        await user.save()
        res.status(201).json(user.address);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
}

export { getAddress, addUserAddress, deleteUserAddress }