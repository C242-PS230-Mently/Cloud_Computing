import { User } from "../config/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from 'nanoid';

// Generate access token
const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

// Generate refresh token
const generateRefreshToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

// Get all users
export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

// Register a new user
export const Register = async (req, res) => {
    const { full_name, email, password, confpassword } = req.body;

    try {
        // Check if user already exists
        const existUser = await User.findOne({ where: { email } });
        if (existUser) {
            return res.status(400).json({ msg: 'Email is already registered' });
        }

        // Validate password confirmation
        if (password !== confpassword) {
            return res.status(400).json({ msg: "Password and confirm password do not match" });
        }

        // Validate email format
        if (!email.includes('@', '.')) {
            return res.status(400).json({ msg: 'Please enter a valid email' });
        }

        // Unik ID for ID User
        const id = nanoid(21);

        // Encrpyt pke 
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        // Create a new user
        await User.create({
            id: id,
            full_name: full_name,
            email: email,
            password: hashPassword
        });

        res.json({ msg: "Registration successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

// Login function
export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ msg: 'Email is not registered' });
        }

        // Validate password
        if (!email || !password) {
            return res.status(400).json({ msg: "Please provide both email and password" });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ msg: 'Email or password is incorrect' });
        }

        // Create access token and refresh token
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Save refresh token to database
        user.token = refreshToken; // Assuming `token` field is used for refresh tokens
        await user.save();

        // Return tokens in response
        res.json({ accessToken, refreshToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

// Logout function
export const Logout = async (req, res) => {
    try {
        const { userId } = req.body;

        // Find user by primary key
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        // Clear the refresh token in the database
        user.token = null; // Clearing the refresh token by setting it to null
        await user.save();

        res.status(200).json({ msg: 'Logged out successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};
