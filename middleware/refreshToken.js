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



export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token from the Authorization header

    if (!token) {
        return res.status(401).json({ msg: 'Access Denied. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ msg: 'Invalid Token' });
        }

        req.userId = decoded.id; // Attach the user ID to the request
        next();
    });
};
