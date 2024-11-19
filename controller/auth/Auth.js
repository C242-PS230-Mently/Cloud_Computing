import { User,UserNotif } from "../../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from 'nanoid';
import { createNotification } from "../user/Users.js";
import { joiLogin,joiRegister } from "./validator.js";
import { Op } from "sequelize";



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
    const { full_name,age,gender, email,username, password, confpassword } = req.body;

    
    const { error } = joiRegister.validate({ full_name, age,gender, email,username, password, confpassword });
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

        await User.create({
            
            id: id,
            full_name: full_name,
            age: age,
            gender: gender,
            username: username,
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
    const { identifier, password } = req.body;

    const { error } = joiLogin.validate({ identifier, password });
    if (error) return res.status(400).json({ msg: error.details[0].message });

    try {
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

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ msg: 'Email or password is incorrect' });
        }

        const accessToken = generateAccessToken(user);

        user.token = accessToken;
        await user.save();

        // Cek apakah notifikasi welcome sudah ada untuk pengguna ini
        const existingNotification = await UserNotif.findOne({
            where: {
                user_id: user.id,
                notif_type: 'Selamat Datang di Mently'
            }
        });

        let newNotification = existingNotification
        if (!existingNotification) {
            newNotification = await UserNotif.create({
                notif_id: nanoid(21), // ID unik
                user_id: user.id,
                notif_type: 'Selamat Datang di Mently',
                notif_content: "Yuk, mulai perjalanan untuk mengenal dan menerima dirimu lebih baik bersama Mently...",
                is_read: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            console.log("New Notification Created:", newNotification);
        }

        return res.status(200).json({ accessToken,newNotification });
    } catch (error) {
        console.error("Error in Login:", error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};



// Logout function
export const Logout = async (req, res) => {
    const { id } = req.body; 

    if (!id) {
        return res.status(400).json({ msg: 'User ID is required for logout' });
    }

    try {
        console.log("Logging out user ID:", id);

       
        const user = await User.findByPk(id);

        if (!user) {
            console.log("User not found for ID:", id);
            return res.status(400).json({ msg: 'User not found' });
        }

        
        user.token = null;
        await user.save();

        res.status(200).json({ msg: 'Logged out successfully' });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

