import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: Number,
    gender: String,
    bloodGroup: String,
    phone: String,
    email: String,
    emergencyContact: String,
    address: String,
    allergies: [String],
    chronicConditions: [String],
    medications: [String],
    pastSurgeries: [String],
    familyHistory: String,
    mentalHealth: String,
    vaccinations: [String],
    lastCheckup: Date,
    healthSummary: String,

    scannedReports: [String],  // URLs to files on Cloudinary
    prescriptions: [String],   // URLs to files on Cloudinary

}, { timestamps: true });

export default mongoose.model('User', userSchema);
