import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import { getUsers, Login, Register, Logout } from "../controller/auth/Auth.js"; 
import { requestPasswordReset,resetPassword } from "../controller/auth/forgotPass.js";
import { getAllQuestions } from "../controller/consult/question.js";
import { getHistory } from "../controller/consult/history.js";
import { fetchApi } from "../controller/consult/consult.js";
import { getNotifByToken } from "../controller/user/notif.js";
import { getAllDataByCategory } from "../controller/Dashboard/routeDasboard.js";
import { getAllDoctors, getDoctorById } from "../controller/doctor/dokter.js";
import { getDashboardById,updatePhoto,editProfile, changePassword, getProfileByToken, url } from "../controller/user/Users.js";


const router = express.Router();

router.get('/', async (req, res) => {
    res.redirect(url);
});

router.get('/users', getUsers);
router.get('/user/history' ,checkAuth,getHistory);
router.get('/user/questions', getAllQuestions);

router.get('/user/dashboard',checkAuth,getDashboardById);
router.get('/user/dashboard/:category', getAllDataByCategory);
router.get('/user/dashboard/:category?/:id?', getAllDataByCategory);

router.get('/user/doctors', getAllDoctors);
router.get('/user/doctors/:id', getDoctorById);

router.get('/user/profile',checkAuth,getProfileByToken)
router.post('/user/upload',checkAuth,updatePhoto);
router.put('/user/edit-profile',checkAuth,editProfile);
router.put('/user/change-pass',checkAuth,changePassword);

router.get('/user/notif',checkAuth,getNotifByToken);
router.post('/user/predict',checkAuth,fetchApi)

router.post('/auth/register', Register);
router.post('/auth/login',Login);
router.post('/auth/logout',checkAuth, Logout);
router.post('/auth/forgot-password', requestPasswordReset);
router.post('/auth/reset-password', resetPassword);


export default router;
