import { Consultation, User } from "../../models/UserModel.js";
import axios from "axios";


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

        // Panggil Flask API
        const flaskResponse = await axios.post('MODEL_URL', payload);

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
            statusCode: flaskResponse.data.statusCode,
        });
    } catch (error) {
        console.error('Error connecting to Flask API:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};