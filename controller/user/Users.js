import { User,UserNotif } from "../../models/UserModel.js";
import {nanoid} from 'nanoid';
import multer from 'multer';
import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });



// dashboard
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
        // Fetch notifications for the logged-in user
        const notifications = await UserNotif.findAll({
            where: { user_id: user.id },
            order: [['createdAt', 'DESC']]
        });

        // Check if there are no notifications
        if (notifications.length === 0) {
            return res.status(404).json({ msg: 'No notifications found for this user.' });
        }

        // Return the notifications if they exist
        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

export const createNotification = async ({ user_id, notif_type, notif_content, is_read, createdAt, updatedAt }) => {
    try {
        await UserNotif.create({
            notif_id: nanoid(21), // Generate unique ID
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








const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
const bucket = storage.bucket(process.env.GCLOUD_BUCKET);



// Route to upload a profile photo
export const updatePhoto = async (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(500).send({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const userId = req.body.userId;

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
    const userId = req.params.id; // Ambil parameter ID dari URL
    console.log('User ID:', userId); // Debugging, pastikan ID diterima

    // Query ke database menggunakan Sequelize
    const user = await User.findByPk(userId);

    // Jika user tidak ditemukan atau tidak memiliki profile photo
    if (!user || !user.profile_photo) {
      return res.status(404).send({ message: 'Profile photo not found.' });
    }

    // Jika ditemukan, kirimkan response
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
    // req.user is already populated by the middleware
    const user = req.user;

    const { full_name, email, password, gender, age } = req.body;

    // Update user data
    user.full_name = full_name || user.full_name;
    user.email = email || user.email;
    user.password = password ? await bcrypt.hash(password, 10) : user.password;
    user.gender = gender || user.gender;
    user.age = age || user.age;

    // Save changes
    await user.save();

    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};







