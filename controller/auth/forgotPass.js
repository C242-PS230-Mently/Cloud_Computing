import { User, UserOtp } from "../../models/UserModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer";





const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // OTP 6 digit
};

export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(404).json({ msg: "User not found" });
    }

    const otp = generateOtp();

    // Simpan OTP ke database
    await UserOtp.create({
        email: user.email,
        otp,
    });

    // Format OTP untuk HTML (setiap digit terpisah)
    const formattedOtp = otp.split('').map(digit => `<span style="margin: 0 5px; font-size: 24px; font-weight: bold;">${digit}</span>`).join('');

    // Konfigurasi nodemailer
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
        subject: "Mently: Password Reset OTP",
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color: #333;">Password Reset Request</h2>
                <p>Your OTP for resetting your password is:</p>
                <div style="background: #f9f9f9; padding: 10px 20px; display: inline-block; border: 1px solid #ddd; border-radius: 5px;">
                    ${formattedOtp}
                </div>
                <p style="margin-top: 20px;">This OTP is valid for 5 minutes. Please do not share it with anyone.</p>
                <p>Thank you,<br>Mently Support Team</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ msg: "OTP sent to email" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ msg: "Failed to send OTP" });
    }
};


export const resetPassword = async (req, res) => {
    const { otp, newPassword } = req.body;

    if (!otp || !newPassword) {
        return res.status(400).json({ msg: "OTP and new password are required" });
    }

    try {
        // Cari OTP di database
        const otpEntry = await UserOtp.findOne({ where: { otp } });
        if (!otpEntry) {
            return res.status(400).json({ msg: "Invalid or expired OTP" });
        }

        // Cari pengguna berdasarkan email dari entri OTP
        const user = await User.findOne({ where: { email: otpEntry.email } });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Hash password baru
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password pengguna
        user.password = hashedPassword;
        await user.save();

        // Hapus OTP setelah digunakan
        await UserOtp.destroy({ where: { otp } });

        res.status(200).json({ msg: "Password reset successful" });
    } catch (error) {
        console.error("Error in resetPassword:", error);
        return res.status(500).json({ msg: "An error occurred while resetting the password" });
    }
};
