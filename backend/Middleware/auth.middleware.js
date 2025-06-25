import dotenv from 'dotenv';
dotenv.config();
import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.JWT_SECRET || "secretkey";
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    console.log("authHeader: ", authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'No token provided!' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log("decoded", decoded);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("Error to find token:", err);
        return res.status(401).json({ message: 'Invalid or expired token!' });
    }
}
function isAdmin(req, res, next) {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        console.log("Forbidden: Admin privileges required");
        return res.status(403).json({ message: 'Forbidden: Admin privileges required' });
    }
}

export { verifyToken, isAdmin }