import { Consultation, User } from "../../models/UserModel.js";
import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

const levelDescriptions = {
    1: "Rendah",
    2: "Sedang",
    3: "Tinggi",
};

export const fetchApi = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { username } = req.user;
        const payload = { ...req.body };
        console.log('Sending payload to Flask API:', payload);
        // Panggil Flask API

        for (let key in payload){
            if (payload[key] ===null || payload[key] === undefined || payload[key] === ""){
                return res.status(400).json({error: `field ${key} tidak boleh`})
            }
        }

        const flaskResponse = await axios.post(
            'https://ml-models-861370546933.asia-southeast2.run.app/predict',
            payload, );
        
        console.log('Flask API Response:', flaskResponse.data);

        // Proses predictions dengan mengganti angka menjadi teks
        const processedPredictions = Object.fromEntries(
            Object.entries(flaskResponse.data.predictions).map(([key, value]) => [key, levelDescriptions[value] || "Tidak diketahui"])
        );

        // Simpan ke database
        await Consultation.create({
            user_id,
            predictions: processedPredictions,
            created_at: new Date(),
        });

        // Kirim respons ke frontend
        res.status(200).json({
            user_id,
            username,
            message: flaskResponse.data.message,
            predictions: processedPredictions,
            created_at: new Date(),
            statusCode: flaskResponse.data.statusCode,
        });
    } catch (error) {
        console.error('Error connecting to Flask API:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};