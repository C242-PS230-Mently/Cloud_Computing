import { Consultation } from "../../models/UserModel.js";



export const getHistory = async (req, res) => {
    try {
        
        const { id } = req.user; 

       
        const consultations = await Consultation.findAll({
            where: { user_id: id }, 
            order: [['created_at', 'DESC']] 
        });

        // Kirimkan data history ke client
        res.status(200).json({
            message: "History anda :",
            history: consultations
        });
    } catch (error) {
        console.error("Error fetching history:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

