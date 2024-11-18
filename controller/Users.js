import { User } from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from 'nanoid';
    
import { joiLogin,joiRegister } from "./validator.js";


const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
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
    const { full_name,age,gender, email, password, confpassword } = req.body;

    
    const { error } = joiRegister.validate({ full_name, age,gender, email, password, confpassword });
    if (error) return res.status(400).json({ msg: error.details[0].message });

    try {
        
        const existUser = await User.findOne({ where: { email } });
        if (existUser) {
            return res.status(400).json({ msg: 'Email is already registered' });
        }

        // nanoid
        const id = nanoid(21);

        // bcyrpt
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        await User.create({
            id: id,
            full_name: full_name,
            age: age,
            gender: gender,
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
    const { email, password } = req.body;

    const { error } = joiLogin.validate({ email, password });
    if (error) return res.status(400).json({ msg: error.details[0].message });

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ msg: 'Email is not registered' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ msg: 'Email or password is incorrect' });
        }

        const accessToken = generateAccessToken(user);
        
       
        user.token = accessToken;
        await user.save();

        await createNotification({
            user_id: user.id,
            notif_type: 'Welcome to Mently', // you can define this type based on your needs
            notif_content: "Let’s make today a good day. Small steps add up, and we’re here with you every step of the way.",
            is_read: 0, // unread
            createdAt: new Date(),
            updatedAt: new Date()
        });


       
        return res.status(200).json({ accessToken });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};


// Logout function
export const Logout = async (req, res) => {
    const { id } = req.body; // Get the user ID from the request body

    if (!id) {
        return res.status(400).json({ msg: 'User ID is required for logout' });
    }

    try {
        console.log("Logging out user ID:", id);

        // Find the user by the ID provided in the request body
        const user = await User.findByPk(id);

        if (!user) {
            console.log("User not found for ID:", id);
            return res.status(400).json({ msg: 'User not found' });
        }

        // Clear the token in the database to log the user out
        user.token = null;
        await user.save();

        res.status(200).json({ msg: 'Logged out successfully' });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};
