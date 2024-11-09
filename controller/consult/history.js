import { UserResponse, UserHistory } from "../../models/UserModel.js";
import { nanoid } from 'nanoid';

export const saveUserHistory = async (req, res) => {
    const { userId } = req.body;

    try {
        
        const responses = await UserResponse.findAll({ where: { user_id: userId } });

        if (responses.length === 0) {
            return res.status(400).json({ msg: "No responses found for the user" });
        }

    
        const scoreSum = responses.reduce((sum, response) => sum + response.option_id, 0);
        const averageScore = scoreSum / responses.length;


        const label = ["Low", "Medium", "High"][Math.min(Math.floor(averageScore - 1), 2)];


        const historyEntry = await UserHistory.create({
            history_id: nanoid(),
            user_id: userId,
            response_id: responses[responses.length - 1].response_id,
            model_result: `Average score: ${averageScore}`,
            label: label,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        res.status(200).json({ msg: "History saved successfully", history: historyEntry });
    } catch (error) {
        console.error("Error in saveUserHistory:", error);
        res.status(500).json({ msg: "Error saving history" });
    }
};


export const getUserHistory = async (req, res) => {
    const { userId } = req.params;

    try {
       
        const history = await UserHistory.findAll({ where: { user_id: userId } });

        if (history.length === 0) {
            return res.status(404).json({ msg: "No history found for the user" });
        }

        res.status(200).json({ history: history });
    } catch (error) {
        console.error("Error in getUserHistory:", error);
        res.status(500).json({ msg: "Error retrieving history" });
    }
};
