import { UserNotif } from '../../models/UserModel.js';
import { nanoid } from 'nanoid';

export const createWelcomeNotification = async (userId) => {
    try {
   
        const existingNotification = await UserNotif.findOne({
            where: {
                user_id: userId,
                notif_type: 'Selamat Datang di Mently'
            }
        });
 
        if (!existingNotification) {
            const newNotification = await UserNotif.create({
                notif_id: nanoid(21), 
                user_id: userId,
                notif_type: 'Selamat Datang di Mently',
                notif_content: "Yuk, mulai perjalanan untuk mengenal dan menerima dirimu lebih baik bersama Mently...",
                is_read: 0, 
                createdAt: new Date(),
                updatedAt: new Date()
            });

            console.log("Notif berhasil dibuat:", newNotification);
            return newNotification;
        }

        return existingNotification; 
    } catch (error) {
        console.error("Gagal membuat notif", error);
        throw new Error("Gagal membuat welcome notif");
    }
};