import { Doctor } from '../../models/UserModel.js';

// CREATE: Menambahkan dokter baru
export const createDoctor = async (req, res) => {
    try {
        const { name, specialization, contact, location, image_url } = req.body;
        const newDoctor = await Doctor.create({
            name,
            specialization,
            contact,
            location,
            image_url
        });

        res.status(201).json({
            message: 'Doctor created successfully',
            doctor: newDoctor
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating doctor' });
    }
};

// GET: Mendapatkan semua dokter
export const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.findAll();
        if (doctors.length > 0) {
            res.status(200).json({
                message: 'Doctors retrieved successfully',
                doctors: doctors
            });
        } else {
            res.status(404).json({
                message: 'No doctors found'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching doctors',
            error: error.message
        });
    }
};

// GET: Mendapatkan dokter berdasarkan ID
export const getDoctorById = async (req, res) => {
    try {
        const { id } = req.params; 
        const doctor = await Doctor.findOne({
            where: { id }
        });
        if (doctor) {
            res.status(200).json({
                message: 'Doctor retrieved successfully',
                doctor
            });
        } else {
            res.status(404).json({
                message: `Doctor with ID ${id} not found`
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching doctor by ID',
            error: error.message
        });
    }
};