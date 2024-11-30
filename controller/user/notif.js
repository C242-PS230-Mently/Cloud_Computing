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

export const getNotifByToken = async (req, res) => {
    try {
        const user_id = req.user.id;

        
        const notifications = await UserNotif.findAll({
            where: { user_id },
            order: [['createdAt', 'DESC']],  
        });

        if (!notifications.length) {
            return res.status(404).json({ message: "No notifications found for this user" });
        }

    
        res.status(200).json({
            user_id,
            notifications: notifications.map((notif) => ({
                notif_id: notif.notif_id,
                notif_type: notif.notif_type,
                notif_content: notif.notif_content,
                is_read: notif.is_read,
                createdAt: notif.createdAt,
            })),
        });
    } catch (error) {
        console.error('Error fetching notifications:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
