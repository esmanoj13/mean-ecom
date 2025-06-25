// const User = require("../db/user");
// const bcrypt = require('bcrypt');
// const jwt = require("jsonwebtoken")
import dotenv from 'dotenv';
dotenv.config();
import User from "../db/user.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';

const userregister = async (req, res) => {
    try {
        const model = req.body;
        // Validate required fields
        if (!model.name || !model.email || !model.password) {
            return res.status(400).json({
                error: "User information are required"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: model.email });
        if (existingUser) {
            return res.status(400).json({
                error: "User already exists with this email."
            });
        }

        // Hash password and create user
        const hashpassword = await bcrypt.hash(model.password, 10);
        const user = new User({
            name: model.name,
            email: model.email,
            password: hashpassword,
            address: model.address,
            // contact: model.contact
        });

        // Save the user
        await user.save();
        return res.status(201).json({
            message: "Registration successful",
            user: {
                name: user.name,
                email: user.email,
                address: user.address,
                // contact: user.contact
            }
        });
    } catch (err) {
        console.error('Registration error:', err);
        return res.status(500).json({
            error: err.message || "An error occurred while registering the user"
        });
    }
}

const userlogin = async (req, res) => {
    try {
        let model = req.body;
        let user = await User.findOne({ email: model.email })
        if (!user || !(await bcrypt.compare(model.password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign(
            { id: user._id, email: user.email, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        return res.status(200).json({ token, user });
    } catch (err) {
        console.error("Error to login user:", err);
        return res.status(500).json({
            error: "An error occurred during login"
        })
    }
}
const userForgotPassword = async (req, res) => {
    const email = req.body.email;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // Here you would send the resetToken to the user's email  
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        const resetLink = `http://localhost:4200/reset-password?token=${resetToken}`;
        await transporter.sendMail({
            to: email,
            subject: 'Reset Your Password',
            html: `<div style="font-family: Arial, sans-serif; padding: 20px;" >
      <h2>Password Reset Request</h2>
      <p>Hi ${user.name || 'User'},</p>
      <p>You requested a password reset. Click the button below to reset your password:</p>
      <a href="${resetLink}" style="background-color: #007BFF; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If you didn’t request this, you can ignore this email.</p>
      <br/>
      <p>Thanks,<br>Your Easymart/p>
    </div >
    `
        });
        return res.status(200).json({ message: 'Reset token sent to email', resetToken });

    } catch (err) {
        console.error("Error to reset password:", err.message, err.stack);
        return res.status(500).json({
            error: "An error occurred while resetting the password"
        });
    }
}
const userResetPassword = async (req, res) => {
    const { token, password } = req.body;

    if (!token || !password) {
        return res.status(400).json({ message: 'Token and password are required' });
    }

    try {
        // Verify the token and extract user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ message: 'Password reset successfully' });
    } catch (err) {
        console.error("Error resetting password:", err.message, err.stack);

        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Password reset link has expired. Please request a new one.'
            });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: 'Invalid reset token. Please request a new password reset.'
            });
        }

        return res.status(500).json({
            message: "An error occurred while resetting the password"
        });
    }
}
export { userregister, userlogin, userResetPassword, userForgotPassword };