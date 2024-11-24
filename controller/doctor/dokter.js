import { nanoid } from 'nanoid';
import { Doctor } from '../../models/UserModel.js';

// CREATE: Tambah dokter baru
export const createDoctor = async (req, res) => {
    try {
        const { name, specialization, contact, location, image_url } = req.body;
        const id = nanoid(10);
        const newDoctor = await Doctor.create({
            id,
            name,
            specialization,
            contact,
            location,
            image_url
        });
        res.status(201).json(newDoctor);
    } catch (error) {
        res.status(500).json({ error: 'Error creating doctor' });
    }
};

// Mendapatkan semua data dokter
export const getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.findAll({ order: [['created_at', 'DESC']] });
        res.status(201).json({
            message : 'creating doctors is success!',
            doctors : doctors
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching doctors' });
    }
};

// GET: Mengambil data dokter berdasarkan ID
export const getDoctorById = async (req, res) => {
    try {
        const { id } = req.params;  
        const doctor = await Doctor.findOne({ where: { id } }); 

        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });  
        }

        res.status(200).json(doctor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching doctor' });
    }
};