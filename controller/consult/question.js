import { Question } from "../../models/UserModel.js"; 

// Get All Questions
export const getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.findAll();

        if (!questions || questions.length === 0) {
            return res.status(404).json({ msg: "No questions found" });
        }

        res.status(200).json({ questions });
    } catch (error) {
        console.error("Error in getAllQuestions:", error);
        res.status(500).json({ msg: "Error retrieving questions" });
    }
};
