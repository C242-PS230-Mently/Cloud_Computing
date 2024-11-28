import express from "express";
import axios from "axios";
import { getUsers, Login, Register, Logout } from "../controller/auth/Auth.js"; 
import checkAuth from "../middleware/checkAuth.js";
import { requestPasswordReset,resetPassword } from "../controller/auth/forgotPass.js";
import { getAllQuestions } from "../controller/consult/question.js";
import { saveUserResponse } from "../controller/consult/response.js";
import { getHistory } from "../controller/consult/history.js";
// import { createNotification,getNotifications, getDashboardById } from "../controller/user/Users.js";
import { getAllDataByCategory, createArticle } from "../controller/Dashboard/routeDasboard.js";
import { createDoctor, getAllDoctors, getDoctorById } from "../controller/doctor/dokter.js";
import { createNotification,getNotifications, getDashboardById,updatePhoto,getprofileById,editProfile, changePassword, getProfileByToken } from "../controller/user/Users.js";

import { fetchApi } from "../controller/consult/consult.js";

const router = express.Router();

//get all users

router.get('/', async (req, res) => {
    try {
        const imageUrl = 'https://storage.googleapis.com/mently-bucket/gif/twittervid.com_hamukukka_123938.gif';
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

        res.set('Content-Type', 'image/gif'); 
        res.send(response.data); 
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).send('Internal Server Error.');
    }
});



router.get('/users', getUsers);
router.get('/user/history' ,checkAuth,getHistory);

//konsul
router.get('/user/questions', getAllQuestions);
router.post('/user/responses', saveUserResponse);

// dasboard
// router.post('/user/articles', createArticle);
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
router.get('/user/profiles',checkAuth,getProfileByToken)

router.get('/user/notif',checkAuth,getNotifications);

router.post('/user/predict',checkAuth,fetchApi)


// auth
router.post('/auth/register', Register);
router.post('/auth/login',Login);
router.post('/auth/logout',checkAuth, Logout);
router.post('/auth/forgot-password', requestPasswordReset);
router.post('/auth/reset-password', resetPassword);


export default router;
