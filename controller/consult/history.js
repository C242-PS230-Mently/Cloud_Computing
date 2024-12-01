import { Consultation } from "../../models/UserModel.js";
import moment from 'moment-timezone';


export const getHistory = async (req, res) => {
    try {
        
        const { id } = req.user; 

        
       const consultations = await Consultation.findAll({
            where: { user_id: id }, 
            order: [['created_at', 'DESC']] 
        });
        
        const Mapconsult = consultations.map (consultation => {
            const createdAt = moment(consultation.created_at).tz('Asia/Singapore').format("YYYY-MM-DD HH:mm:ss");
            return {
                ...consultation.toJSON(),  
                created_at: createdAt 
            };
        });

        res.status(200).json({
            message: "History anda:",
            data: Mapconsult,  
        });
    } catch (error) {
        console.error("Error fetching history:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

