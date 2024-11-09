import jwt from 'jsonwebtoken';

const checkAuth = (req, res, next) => {
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) return next(); 

    jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(); 
        req.user = user; 
        return res.status(403).json({ msg: 'User is already logged in' });
    });
};

export default checkAuth;
