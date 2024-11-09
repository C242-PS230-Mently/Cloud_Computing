import jwt from 'jsonwebtoken';

const checkAuth = (req, res, next) => {
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) return next(); // If there's no access token, proceed to the next middleware

    jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(); // If verification fails, proceed to the next middleware
        req.user = user; // Attach the user information to the request
        return res.status(403).json({ msg: 'User is already logged in' });
    });
};

export default checkAuth;
