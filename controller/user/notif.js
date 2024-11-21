import { UserNotif } from '../../models/UserModel.js';// Sesuaikan dengan path model Anda
import { nanoid } from 'nanoid';

// Fungsi untuk membuat notifikasi jika belum ada
export const createWelcomeNotification = async (userId) => {
    try {
        // Periksa apakah notifikasi welcome sudah ada
        const existingNotification = await UserNotif.findOne({
            where: {
                user_id: userId,
                notif_type: 'Selamat Datang di Mently'
            }
        });

        // Jika belum ada, buat notifikasi baru
        if (!existingNotification) {
            const newNotification = await UserNotif.create({
                notif_id: nanoid(21), // ID unik untuk notifikasi
                user_id: userId,
                notif_type: 'Selamat Datang di Mently',
                notif_content: "Yuk, mulai perjalanan untuk mengenal dan menerima dirimu lebih baik bersama Mently...",
                is_read: 0, // Belum dibaca
                createdAt: new Date(),
                updatedAt: new Date()
            });

            console.log("New Notification Created:", newNotification);
            return newNotification;
        }

        return existingNotification; // Jika sudah ada, kembalikan notifikasi yang ada
    } catch (error) {
        console.error("Error in createWelcomeNotification:", error);
        throw new Error("Failed to create or retrieve welcome notification");
    }
};