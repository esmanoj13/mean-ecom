// const User = require("../db/user");
// const bcrypt = require('bcrypt');
// const jwt = require("jsonwebtoken")

import User from "../db/user.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const userregister = async (req, res) => {
    try {
        let model = req.body;
        let hashpassword = await bcrypt.hash(model.password, 10);
        let user = new User({
            name: model.name,
            email: model.email,
            password: hashpassword
        })
        if (!user) {
            return res.status(404).json({ error: "Please fill the data." })
        }
        await user.save();
        return res.status(200).json("Regiter successfully");
    } catch (err) {
        console.error("Error to register user:", err);
        return res.status(500).json({
            error: "An error occurred to register the user"
        })
    }
}

const userlogin = async (req, res) => {
    try {
        let model = req.body;
        let user = await User.findOne({ email: model.email })
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log(user);
        let isMatched = await bcrypt.compare(model.password, user.password);
        console.log(isMatched);
        if (isMatched) {
            const secretKey = 'secretkey';
            const token = jwt.sign(
                { id: user._id, email: user.email, isAdmin: user.isAdmin },
                secretKey,
                { expiresIn: '24h' }
            );
            return res.status(200).json({ token, user });
        } else {
            return res.status(401).json({ message: 'Invalid password' });
        }
    } catch (err) {
        console.error("Error to login user:", err);
        return res.status(500).json({
            error: "An error occurred to login the user"
        })
    }
}


export { userregister, userlogin }