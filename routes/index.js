import express from "express";
import { getUsers, Login, Register, Logout } from "../controller/Users.js"; 
import checkAuth from "../middleware/checkAuth.js";
import { verifyRefreshToken,verifyToken } from "../middleware/refreshToken.js";
import jwt from "jsonwebtoken";
import { requestPasswordReset,resetPassword } from "../controller/forgotPass.js";
import { getAllQuestions } from "../controller/consult/question.js";
import { saveUserResponse } from "../controller/consult/response.js";
import { saveUserHistory,getUserHistory } from "../controller/consult/history.js";
import { createNotification,getNotifications, getDashboardById,updatePhoto,getprofileById,editProfile } from "../controller/user/Users.js";
import { createNotification,getNotifications, getDashboardById } from "../controller/user/Users.js";
import { createArticle, getArticles, getArticleById } from "../controller/Dasboard/routeDasboard.js";
import { createDoctor, getDoctors, getDoctorById } from "../controller/doctor/dokter.js";

const router = express.Router();

//get all users
router.get('/users', getUsers);

//history : tunggu model ml
router.get('/user/gethistory',getUserHistory);
router.post('/user/history' ,saveUserHistory);

//konsul
router.get('/user/questions', getAllQuestions);
router.post('/user/responses', saveUserResponse);

//update profile
router.get('/user/getphoto',getprofileById);
router.post('/user/upload',updatePhoto);
router.put('/user/editprofile',checkAuth,editProfile);

// Dasboard
router.get('/user/articles', getArticles);
router.get('/user/articles/', getArticleById);
router.post('/user/articles', createArticle);
router.get('/user/dashboard/',getDashboardById);

//notif 
router.get('/user/getNotif',checkAuth,getNotifications);
router.post('/user/notif',checkAuth,createNotification);

// auth
router.post('/auth/register', Register);
router.post('/auth/login',Login);
router.post('/auth/logout', Logout);
router.post('/auth/forgot-password', requestPasswordReset);
router.post('/auth/reset-password', resetPassword);

// // data doctor
// router.post('/user/doctors', createDoctor);
// router.get('/user/doctors', getDoctors);
// router.get('/user/doctors/:id', getDoctorById);

// refresh token
router.post('/token', verifyRefreshToken, (req, res) => {
    const accessToken = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ accessToken });
});


export default router;
