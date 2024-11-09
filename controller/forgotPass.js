import { User, UserOtp } from "../models/UserModel.js";
import bcrypt from 'bcrypt';
import nodemailer from "nodemailer";
import crypto from "crypto";

// Request password reset
export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(404).json({ msg: "User not found" });
    }

    // Generate OTP or token
    const otp = crypto.randomBytes(3).toString("hex"); // Generate a 6-character OTP

    // Save OTP in the user_otp table
    await UserOtp.create({
        email: user.email,
        otp,
    });

    // Send OTP to user's email
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ msg: "OTP sent to email" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ msg: "Failed to send OTP" });
    }
};


// Verify OTP and reset password
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    // Find the OTP entry in user_otp table
    const otpEntry = await UserOtp.findOne({ where: { email, otp } });
    if (!otpEntry) {
        return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    // Find the user and update password
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(404).json({ msg: "User not found" });
    }

    // Encrypt the new password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // Delete the OTP entry after successful password reset
    await UserOtp.destroy({ where: { email, otp } });

    res.status(200).json({ msg: "Password reset successful" });
};
