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
            return res.status(400).json({ msg: 'Email ini telah terdaftar' });
        }
        const existUser = await User.findOne({ where: { username } });
        if (existUser) {
            return res.status(400).json({ msg: 'Username ini telah terdaftar' });
        }



        const id = nanoid(21);
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
            return res.status(400).json({ msg: 'Email belum terdaftar' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ msg: 'Email atau Password salah' });
        }
        const accessToken = generateAccessToken(user);
        user.token = accessToken;
        await user.save();

        await createWelcomeNotification(user.id);

     
        return res.status(200).json({
            msg: 'Login Berhasil',
            accessToken: accessToken,
            user: {
                id: user.id,
                fullName: user.full_name,
                username: user.username,
                email: user.email,
                
            }
        });
    } catch (error) {
        console.error("Gagal Login:", error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};



// Logout function
export const Logout = async (req, res) => {
    try {
        const user = req.user;

        console.log("Logging out user ID:", user.id);
        user.token = null;
        await user.save();

        res.status(200).json({ msg: 'Logout Berhasil' });
    } catch (error) {
        console.error("Gagal Logout", error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

