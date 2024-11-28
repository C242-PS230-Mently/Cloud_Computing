import jwt from 'jsonwebtoken';
import { User } from '../models/UserModel.js';

const checkAuth = async (req, res, next) => {
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) {
        return res.status(401).json({ msg: 'Access Denied. No token provided.' });
    }
    try {
        
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        const user = await User.findOne({ where: { id: decoded.id } });
        if (!user || user.token === null) {
            return res.status(401).json({ msg: 'Access Denied. No token provided or session expired.' });
        }
        if (user.token !== accessToken) {
            return res.status(403).json({ msg: 'Invalid token.' });
        }
        req.user = user;
        next();
    } catch (err) {
        console.error("Token verification failed:", err.message);
        return res.status(403).json({ msg: 'Invalid Token' });
    }
};

export default checkAuth;
