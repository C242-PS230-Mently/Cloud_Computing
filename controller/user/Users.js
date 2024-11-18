import { UserNotif } from "../../models/UserModel.js";
import {nanoid} from 'nanoid';

// dashboard
export const getDashboardById = (req, res) => {
    const { user } = req;
    return res.status(200).json({
        msg: 'Dashboard data',
        userId: user.id,
        fullName: user.full_name,
        email: user.email,
    });
};

export const getNotifications = async (req, res) => {
    const { user } = req; // Assuming req.user is populated with user data if logged in

    // Check if the user is logged in
    if (!user) {
        return res.status(401).json({ msg: 'No user logged in. Cannot retrieve notifications.' });
    }

    try {
        // Fetch notifications for the logged-in user
        const notifications = await UserNotif.findAll({
            where: { user_id: user.id },
            order: [['createdAt', 'DESC']]
        });

        // Check if there are no notifications
        if (notifications.length === 0) {
            return res.status(404).json({ msg: 'No notifications found for this user.' });
        }

        // Return the notifications if they exist
        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

export const createNotification = async ({ user_id, notif_type, notif_content, is_read, createdAt, updatedAt }) => {
    try {
        await UserNotif.create({
            notif_id: nanoid(21), // Generate unique ID
            user_id,
            notif_type,
            notif_content,
            is_read,
            createdAt,
            updatedAt
        });
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};