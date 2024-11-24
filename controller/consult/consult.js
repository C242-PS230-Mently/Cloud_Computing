import { Consultation } from "../../models/UserModel.js";
import axios from "axios";

export const fetchApi = async (req, res) => { 
    try {
        const user_id = req.user.id;
        const payload = { ...req.body };
        const flaskResponse = await axios.post('http://127.0.0.1:5000/predict', payload);
        await Consultation.create({
            user_id: user_id,
            predictions: flaskResponse.data.predictions,
            created_at: new Date()
        });
        res.status(200).json({
            user_id: user_id,
            ...flaskResponse.data
        });
    } catch (error) {
        console.error('Error connecting to Flask API:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
