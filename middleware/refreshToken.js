import jwt from 'jsonwebtoken';
import {User} from '../models/UserModel.js';

export const verifyRefreshToken = async (req, res, next) => {
    const token = req.headers['x-refresh-token'];
    if (!token) return res.sendStatus(401); 

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET); 
        const user = await User.findOne({ where: { id: decoded.id } });

        if (!user || user.refresh_token !== token) {
            return res.sendStatus(403); 
        }

        req.user = user; 
        next(); 
    } catch (error) {
        return res.sendStatus(403); 
    }
};



export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: 'Access Denied. No token provided.' });
    }

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        
        const user = await User.findOne({ where: { token } });
        if (!user) {
            return res.status(403).json({ msg: 'Invalid or expired token. Please log in again.' });
        }

        
        req.userId = user.id;
        next();
    } catch (err) {
        console.error("Token verification failed:", err.message);
        return res.status(403).json({ msg: 'Invalid Token' });
    }
};
