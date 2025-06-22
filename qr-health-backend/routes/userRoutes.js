import express from 'express';
import User from '../models/User.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup multer-storage-cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'qr-health-app',
        allowed_formats: ['jpg', 'png', 'pdf'],
    },
});

const parser = multer({ storage });

// POST /api/users - create user with optional uploads
router.post('/', parser.fields([
    { name: 'scannedReports', maxCount: 5 },
    { name: 'prescriptions', maxCount: 5 }
]), async (req, res) => {
    console.log('BODY:', req.body);
    console.log('FILES:', req.files);

    try {
        const {
            name, age, gender, bloodGroup, phone, email,
            emergencyContact, address, allergies, chronicConditions,
            medications, pastSurgeries, familyHistory, mentalHealth,
            vaccinations, lastCheckup, healthSummary,
        } = req.body;

        // Prepare file URLs
        const scannedReports = req.files['scannedReports']?.map(file => file.path) || [];
        const prescriptions = req.files['prescriptions']?.map(file => file.path) || [];

        const newUser = new User({
            name,
            age,
            gender,
            bloodGroup,
            phone,
            email,
            emergencyContact,
            address,
            allergies: allergies ? JSON.parse(allergies) : [],
            chronicConditions: chronicConditions ? JSON.parse(chronicConditions) : [],
            medications: medications ? JSON.parse(medications) : [],
            pastSurgeries: pastSurgeries ? JSON.parse(pastSurgeries) : [],
            familyHistory,
            mentalHealth,
            vaccinations: vaccinations ? JSON.parse(vaccinations) : [],
            lastCheckup: lastCheckup ? new Date(lastCheckup) : null,
            healthSummary,
            scannedReports,
            prescriptions,
        });

        const savedUser = await newUser.save();
        res.status(201).json({ userId: savedUser._id });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/users/:id - get user by id
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).lean();
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
