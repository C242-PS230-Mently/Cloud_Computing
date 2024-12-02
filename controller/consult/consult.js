import { Consultation, User,UserNotif } from "../../models/UserModel.js";
import axios from "axios";
import dotenv from 'dotenv';
import {nanoid} from 'nanoid';
import moment from 'moment-timezone';

dotenv.config();
const Model_URL = process.env.MODEL_URL;
console.log(Model_URL);
const levelDescriptions = {
    1: "Rendah",
    2: "Sedang",
    3: "Tinggi",
};

export const fetchApi = async (req, res) => {
    try {
        
        const user_id = req.user.id;
        
        const { username } = req.user;
        const payload = req.body;
     

        const flaskResponse = await axios.post(
            Model_URL,
            payload, );
        
        const processedPredictions = Object.fromEntries(
            Object.entries(flaskResponse.data.predictions).map(([key, value]) => [key, levelDescriptions[value] || "Tidak diketahui"])
        );
        const totalConsultations = await Consultation.count({ where: { user_id },distinct: true });
        const notificationMessage =await `Selamat atas konsultasi ke-${totalConsultations} kamu.Yuk Cek di sini untuk melihat detailnya.`;
        const totalConsult = await `Konsultasi ${totalConsultations}`;
        
        const consultation = await Consultation.create({

            user_id,
            predictions: processedPredictions,
            total_consult: totalConsult,
        });
        const createdAt = moment(consultation.created_at).tz('Asia/Singapore').format("YYYY-MM-DD HH:mm:ss");
        
        

        await UserNotif.create({
            user_id,
            notif_id: nanoid(21),
            notif_type: 'Konsultasi',
            notif_content: notificationMessage,
            history_id: consultation.id,  
        });

        res.status(200).json({
            
            user_id,
            username,
            Consult: totalConsult,
            message: flaskResponse.data.message,
            predictions: processedPredictions,
            created_at: createdAt,
            statusCode: flaskResponse.data.statusCode,
        });
    } catch (error) {
        console.error('Error connecting to Flask API:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};