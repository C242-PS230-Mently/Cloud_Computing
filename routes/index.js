import express from "express";

import { getUsers, Login, Register, Logout } from "../controller/Users.js"; 
import checkAuth from "../middleware/checkAuth.js";
import { verifyRefreshToken } from "../middleware/refreshToken.js";
import jwt from "jsonwebtoken";
import { requestPasswordReset,resetPassword } from "../controller/forgotPass.js";

const router = express.Router();

// Route to get all users
router.get('/users', getUsers);

// Route to register a new user
router.post('/register', checkAuth, Register);

// Route to log in a user
router.post('/login', checkAuth, Login);

// Route to log out a user
router.post('/logout', Logout);
// Route to request a password reset link
router.post('/forgot-password', requestPasswordReset);

// Route to reset the password using the token
router.post('/reset-password', resetPassword);
// Route to refresh the access token
router.post('/token', verifyRefreshToken, (req, res) => {
    const accessToken = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ accessToken });
});

export default router;
