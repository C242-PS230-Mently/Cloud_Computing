import { UserResponse, Question } from "../../models/UserModel.js";
import { nanoid } from 'nanoid';

// Save User Response
export const saveUserResponse = async (req, res) => {
    const { userId, questionId, optionId } = req.body;
    try {

        const question = await Question.findOne({ where: { question_id: questionId } });
        if (!question) {
            return res.status(404).json({ msg: "Question not found" });
        }

        const responseId = nanoid();
        const userResponse = await UserResponse.create({
            response_id: responseId,
            user_id: userId,
            question_id: questionId,
            option_id: optionId,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        res.status(200).json({ msg: "Response saved successfully", response: userResponse });
    } catch (error) {
        console.error("Error in saveUserResponse:", error);
        res.status(500).json({ msg: "Error saving response" });
    }
};
