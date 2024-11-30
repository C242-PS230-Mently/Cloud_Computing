import { User,UserNotif } from "../../models/UserModel.js";
import {nanoid} from 'nanoid';
import multer from 'multer';
import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { editPass, joiEdit } from "../auth/validator.js";



export const getProfileByToken = async (req,res) =>{
  const user = req.user;  

  try {

    const userData = await User.findOne({
      where: { id: user.id },  
    });

    if (!userData) {
      return res.status(404).json({ message: 'User Tidak Ditemukan.' });
    }

    return res.status(200).json({
      message: 'User profile fetched successfully',
      data: {
        fullName: user.full_name,
        username: user.username,
        email: user.email,
        age: user.age,
        gender: user.gender
        
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const getDashboardById = (req, res) => {

    const { user } = req;
    const greetMessage = `Hai,${user.username}!`
    return res.status(200).json({
        msg: 'Dashboard data',
        greet: greetMessage,
        userId: user.id,
        username: user.username,
        fullName: user.full_name,
        email: user.email,
    });
};

export const getNotifications = async (req, res) => {
    const { user } = req; 


    if (!user) {
        return res.status(401).json({ msg: 'No user logged in. Cannot retrieve notifications.' });
    }

    try {
    
        const notifications = await UserNotif.findAll({
            where: { user_id: user.id },
            order: [['createdAt', 'DESC']]
        });

        
        if (notifications.length === 0) {
            return res.status(404).json({ msg: 'No notifications found for this user.' });
        }

        
        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

export const createNotification = async ({ user_id, notif_type, notif_content, is_read, createdAt, updatedAt }) => {
    try {
        await UserNotif.create({
            notif_id: nanoid(21), 
            user_id,
            notif_type,
            notif_content,
            is_read,
            createdAt,
            updatedAt
        });
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};


const limitPhoto = 1048576 ;
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage,
          limits: {fileSize: limitPhoto}
 });

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
const bucket = storage.bucket(process.env.GCLOUD_BUCKET);



export const updatePhoto = async (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).send({
          error: 'File terlalu besar. Maksimal ukuran file adalah 1 MB.',
        });
      }
      return res.status(500).send({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    
    const user = req.user;  

    const userId = user.id;  

    if (!userId) {
      return res.status(400).send('User ID is required.');
    }

    try {
      const blob = bucket.file(`userProfile/${userId}-profile-pic-${Date.now()}`);
      const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: req.file.mimetype,
      });

      blobStream.on('finish', async () => {
        const publicUrl = `https://storage.googleapis.com/${process.env.GCLOUD_BUCKET}/${blob.name}`;

        await User.update(
          { profile_photo: publicUrl },
          { where: { id: userId } }
        );

        res.status(200).send({
          message: 'Profile photo uploaded successfully',
          url: publicUrl,
        });
      });

      blobStream.on('error', (err) => {
        res.status(500).send({ error: err.message });
      });

      blobStream.end(req.file.buffer);
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  });
};

export const getprofileById = async (req, res) => {
  try {
    const userId = req.params.id; 
    console.log('User ID:', userId); 
    const user = await User.findByPk(userId);

    if (!user || !user.profile_photo) {
      return res.status(404).send({ message: 'Profile photo not found.' });
    }


    res.status(200).send({
      message: 'Profile photo found',
      url: user.profile_photo,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).send({ message: 'Internal server error.' });
  }
};



export const editProfile = async (req, res) => {
  try {
    const user = req.user;

    const { full_name, email,username, gender, age } = req.body;

    const existMail = await User.findOne({ where: { email } });
    if (existMail) {
        return res.status(400).json({ msg: 'Email is already exist' });
    }
    const existUser = await User.findOne({ where: { username } });
    if (existUser) {
        return res.status(400).json({ msg: 'Username is already exist' });
    }

    const { error } = joiEdit.validate({ full_name, age,gender, email,username});
    if (error) return res.status(400).json({ msg: error.details[0].message });

    // Update user data
    user.full_name = full_name || user.full_name;
    user.username = username || user.username;
    user.email = email || user.email;
    user.gender = gender || user.gender;
    user.age = age || user.age;

    // Save changes
    await user.save();

    const userEdit = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      username: user.username,
      gender: user.gender,
      age: user.age
    }

    res.status(200).json({ message: 'Profile updated successfully', data: userEdit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const changePassword = async (req,res) =>{
  try {
    
    const user = req.user
    const {password} = req.body;

    const { error } = editPass.validate({ password});
    if (error) return res.status(400).json({ msg: error.details[0].message });

    const salt = await bcrypt.genSalt(10);
    const hashPassword =await bcrypt.hash(password,salt)

    user.password = hashPassword ;

    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });

  } catch (error) {
        console.error("Error changing password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const url='https://storage.googleapis.com/mently-bucket/gif/twittervid.com_hamukukka_123938.gif';







