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
