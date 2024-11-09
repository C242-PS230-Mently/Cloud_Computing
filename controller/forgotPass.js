import { User, UserOtp } from "../models/UserModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer";





export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

      
        const resetToken = jwt.sign(
            { id: user.id }, 
            process.env.JWT_RESET_SECRET, 
            { expiresIn: '1h' } 
        );

  
        await UserOtp.create({
            email: user.email,
            reset_token: resetToken,
        });

       
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        
        const resetLink = `http://localhost:5000/reset-password?token=${resetToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset Link",
            text: `Click the link below to reset your password:\n\n${resetLink}`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ msg: "Password reset link sent to email" });
    } catch (error) {
        console.error("Error in requestPasswordReset:", error);
        res.status(500).json({ msg: "Failed to send password reset email" });
    }
};


export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);

        
        const otpEntry = await UserOtp.findOne({ where: { reset_token: token } });
        if (!otpEntry) {
            return res.status(400).json({ msg: "Invalid or expired reset token" });
        }

        
        const user = await User.findOne({ where: { email: otpEntry.email } });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

    
        await UserOtp.destroy({ where: { reset_token: token } });

        res.status(200).json({ msg: "Password reset successful" });
    } catch (error) {
        console.error("Error in resetPassword:", error);
        return res.status(400).json({ msg: "Invalid or expired token" });
    }
};
