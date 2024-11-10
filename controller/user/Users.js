import { json } from "sequelize";
import { User,UserNotif } from "../../models/UserModel.js";

export const getDashboardById = (req, res) => {
    // Since checkAuth already verified the token and user, we can assume req.user is valid
    const { user } = req;

    return res.status(200).json({
        msg: 'Dashboard data retrieved successfully',
        userId: user.id,
        fullName: user.full_name,
        email: user.email,
    });
};