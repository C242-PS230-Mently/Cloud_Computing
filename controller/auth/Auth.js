import { User } from "../../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from 'nanoid';
import { createWelcomeNotification } from "../user/notif.js";
import { joiLogin,joiRegister } from "./validator.js";
import { Op } from "sequelize";



const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '50m' });
};


// const generateRefreshToken = (user) => {
//     return jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
// };



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
    const { full_name,age,gender, email,username, password } = req.body;

    
    const { error } = joiRegister.validate({ full_name, age,gender, email,username, password });
    if (error) return res.status(400).json({ msg: error.details[0].message });

    try {
        
        const existMail = await User.findOne({ where: { email } });
        if (existMail) {
            return res.status(400).json({ msg: 'Email is already registered' });
        }
        const existUser = await User.findOne({ where: { username } });
        if (existUser) {
            return res.status(400).json({ msg: 'Username is already registered' });
        }


        // nanoid
        const id = nanoid(21);

        // bcyrpt
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            
            id: id,
            full_name: full_name,
            age: age,
            gender: gender,
            username: username,
            email: email,
            password: hashPassword
        });

        return res.status(201).json({
            msg: "Registration successful",
            user: {
                id: newUser.id,
                full_name: newUser.full_name,
                age: newUser.age,
                gender: newUser.gender,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

// Login function
export const Login = async (req, res) => {
    const { identifier, password } = req.body;

    // Validate request payload
    const { error } = joiLogin.validate({ identifier, password });
    if (error) return res.status(400).json({ msg: error.details[0].message });

    try {
        // Find user by email or username
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { email: identifier },
                    { username: identifier }
                ]
            }
        });

        if (!user) {
            return res.status(400).json({ msg: 'Email or username is not registered' });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ msg: 'Email or password is incorrect' });
        }

        // Generate access token
        const accessToken = generateAccessToken(user);

        // Update user token in the database
        user.token = accessToken;
        await user.save();

        // Create welcome notification (if not already created)
        await createWelcomeNotification(user.id);

        // Return detailed response
        return res.status(200).json({
            msg: 'Login successful',
            accessToken: accessToken,
            user: {
                id: user.id,
                fullName: user.full_name,
                username: user.username,
                email: user.email,
                
            }
        });
    } catch (error) {
        console.error("Error in Login:", error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};



// Logout function
export const Logout = async (req, res) => {
    try {
        // Ambil user dari middleware checkAuth
        const user = req.user;

        console.log("Logging out user ID:", user.id);

        // Nullify the token in the database to logout the user
        user.token = null;
        await user.save();

        res.status(200).json({ msg: 'Logged out successfully' });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

