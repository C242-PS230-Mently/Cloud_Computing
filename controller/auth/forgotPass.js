import { User, UserOtp } from "../../models/UserModel.js";
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

        
        const resetLink = `https://mentlyapps-861370546933.asia-southeast2.run.app/reset-password?token=${resetToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Mently Password Reset Link",
            html: `
                <p>Click the button below to reset your password:</p>
                <p style="text-align: center;">
                    <a href="${resetLink}" style="
                        display: inline-block;
                        padding: 10px 20px;
                        font-size: 16px;
                        color: #ffffff;
                        background-color: #007BFF;
                        text-decoration: none;
                        border-radius: 5px;
                    ">Reset Password</a>
                </p>
                <p>If you didn’t request this, please ignore this email.</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ msg: "Password reset link sent to email" });
    } catch (error) {
        console.error("Error in requestPasswordReset:", error);
        res.status(500).json({ msg: "Failed to send password reset email" });
    }
};


export const resetPassword = async (req, res) => {
    const { reset_token, newPassword } = req.body;

    
    if (!reset_token || !newPassword) {
        return res.status(400).json({ msg: "Token and new password are required" });
    }

    try {
        
        const decoded = jwt.verify(reset_token, process.env.JWT_RESET_SECRET);

        const otpEntry = await UserOtp.findOne({ where: { reset_token } });
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

        await UserOtp.destroy({ where: { reset_token } });

      
        res.status(200).json({ msg: "Password reset successful" });
    } catch (error) {
        console.error("Error in resetPassword:", error);
        return res.status(400).json({ msg: "Invalid or expired token" });
    }
};
