import express from "express";
import { getUsers, Login, Register, Logout } from "../controller/auth/Auth.js"; 
import checkAuth from "../middleware/checkAuth.js";
import { verifyRefreshToken,verifyToken } from "../middleware/refreshToken.js";
import jwt from "jsonwebtoken";
import { requestPasswordReset,resetPassword } from "../controller/auth/forgotPass.js";
import { getAllQuestions } from "../controller/consult/question.js";
import { saveUserResponse } from "../controller/consult/response.js";
import { saveUserHistory,getUserHistory } from "../controller/consult/history.js";
// import { createNotification,getNotifications, getDashboardById } from "../controller/user/Users.js";
import { createArticle, getAllDataByCategory } from "../controller/Dasboard/routeDasboard.js";
import { createDoctor, getAllDoctors, getDoctorById } from "../controller/doctor/dokter.js";
import { createNotification,getNotifications, getDashboardById,updatePhoto,getprofileById,editProfile, changePassword } from "../controller/user/Users.js";

const router = express.Router();

//get all users
router.get('/', (req,res) => {
    res.redirect('https://storage.googleapis.com/mently-bucket/gif/twittervid.com_hamukukka_123938.gif');
});
router.get('/users', getUsers);

//history : tunggu model ml
router.get('/user/gethistory',getUserHistory);
router.post('/user/history' ,saveUserHistory);

//konsul
router.get('/user/questions', getAllQuestions);
router.post('/user/responses', saveUserResponse);

// dasboard
router.get('/user/dashboard/',checkAuth,getDashboardById,getNotifications);

// articles
router.post('/user/articles', createArticle); 
router.get('/user/articles', getAllDataByCategory);
router.get('/user/articles/:category', getAllDataByCategory);
router.get('/user/articles/:category?/:id?', getAllDataByCategory);

// doctor
router.post('/user/doctors', createDoctor);
router.get('/user/doctors', getAllDoctors);
router.get('/user/doctors/:id', getDoctorById);

//update profile
router.get('/user/photo/:id',getprofileById);
router.post('/user/upload',checkAuth,updatePhoto);
router.put('/user/editprofile',checkAuth,editProfile);
router.put('/user/changepass',checkAuth,changePassword);


router.get('/user/notif',checkAuth,getNotifications);
// router.post('/user/notif',checkAuth,createNotification);

// auth
router.post('/auth/register', Register);
router.post('/auth/login',Login);
router.post('/auth/logout',checkAuth, Logout);
router.post('/auth/forgot-password', requestPasswordReset);
router.post('/auth/reset-password', resetPassword);

// // data doctor (belum ada)
// router.post('/user/doctors', createDoctor);
// router.get('/user/doctors', getDoctors);
// router.get('/user/doctors/:id', getDoctorById);

// refresh token
router.post('/token', verifyRefreshToken, (req, res) => {
    const accessToken = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ accessToken });
});


export default router;
