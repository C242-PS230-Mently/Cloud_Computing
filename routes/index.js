import express from "express";
import { getUsers, Login, Register, Logout } from "../controller/Users.js"; 
import checkAuth from "../middleware/checkAuth.js";
import { verifyRefreshToken,verifyToken } from "../middleware/refreshToken.js";
import jwt from "jsonwebtoken";
import { requestPasswordReset,resetPassword } from "../controller/forgotPass.js";
import { getAllQuestions } from "../controller/consult/question.js";
import { saveUserResponse } from "../controller/consult/response.js";
import { saveUserHistory,getUserHistory } from "../controller/consult/history.js";
import { getDashboardById } from "../controller/user/Users.js";
const router = express.Router();

// dikit lg jadi
router.get('/users', getUsers);
router.get('/user/gethistory',getUserHistory)
router.get('/user/questions', getAllQuestions);
router.post('/user/responses', saveUserResponse);
router.post('/user/history' ,saveUserHistory)



// auth
router.post('/auth/register', Register);
router.post('/auth/login',Login);
router.post('/auth/logout', Logout);
router.post('/auth/forgot-password', requestPasswordReset);
router.post('/auth/reset-password', resetPassword);

//User
router.get('/user/dashboard/',checkAuth ,getDashboardById)

router.post('/token', verifyRefreshToken, (req, res) => {
    const accessToken = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ accessToken });



   
});

export default router;
