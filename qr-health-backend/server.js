import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

// ✅ Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// ✅ Allowed Origins
const allowedOrigins = [
    'https://qrhelper-jq1d-git-main-vardhan011s-projects.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
];


// ✅ CORS Middleware
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error('❌ Blocked by CORS:', origin); // optional debug log
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// ✅ JSON Parser
app.use(express.json());

// ✅ MongoDB Connect
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Routes
app.use('/api/users', userRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
