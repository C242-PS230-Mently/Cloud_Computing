import { User, UserOtp } from "../../models/UserModel.js";
import bcrypt from 'bcrypt';
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


    await UserOtp.create({
        email: user.email,
        otp,
    });

    const formattedOtp = otp.split('').map(digit => `<span style="margin: 0 5px; font-size: 24px; font-weight: bold;">${digit}</span>`).join('');

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
        <div style="font-family: Arial, sans-serif; line-height: 1.8; color: #333;">
        <h2 style="color: #333; margin-bottom: 20px;">Permintaan Atur Ulang Kata Sandi</h2>
        <p style="margin-bottom: 15px;">Kode OTP Anda untuk mengatur ulang kata sandi adalah:</p>
        <div style="background: #f9f9f9; padding: 15px 25px; display: inline-block; border: 1px solid #ddd; border-radius: 8px; font-size: 18px; font-weight: bold;">
                 ${formattedOtp}
    </div>
         <p style="margin-top: 20px; margin-bottom: 15px;">Kode OTP ini berlaku selama <strong>5 menit</strong>. Mohon jangan membagikannya kepada siapa pun untuk menjaga keamanan akun Anda.</p>
         <p style="margin-top: 30px;">Terima kasih,<br><strong>Tim Dukungan Mently</strong></p>
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
        const otpEntry = await UserOtp.findOne({ where: { otp } });
        if (!otpEntry) {
            return res.status(400).json({ msg: "Invalid or expired OTP" });
        }

        const user = await User.findOne({ where: { email: otpEntry.email } });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();
        await UserOtp.destroy({ where: { otp } });

        res.status(200).json({ msg: "Password reset successful" });
    } catch (error) {
        console.error("Error in resetPassword:", error);
        return res.status(500).json({ msg: "An error occurred while resetting the password" });
    }
};
