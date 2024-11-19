import { Question } from "../../models/UserModel.js"; 


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

export const getQuestionById = async (req, res) => {
    try {
        const { id } = req.params;

       
        const question = await Question.findOne({
            where: { question_id: id },
        });

   
        if (!question) {
            return res.status(404).json({ msg: `Question with id ${id} not found` });
        }

        // Jika ditemukan
        res.status(200).json({ question });
    } catch (error) {
        console.error("Error in getQuestionById:", error);
        res.status(500).json({ msg: "Error retrieving question" });
    }
};
