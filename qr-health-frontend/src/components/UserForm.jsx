import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '', age: '', gender: '', bloodGroup: '', phone: '', email: '', emergencyContact: '', address: '',
        allergies: '', chronicConditions: '', medications: '', pastSurgeries: '', familyHistory: '', mentalHealth: '',
        vaccinations: '', lastCheckup: '', healthSummary: ''
    });

    const [scannedReports, setScannedReports] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, type) => {
        const files = Array.from(e.target.files);
        if (type === 'scannedReports') setScannedReports(files);
        else setPrescriptions(files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (["allergies", "chronicConditions", "medications", "pastSurgeries", "vaccinations"].includes(key)) {
                    data.append(key, JSON.stringify(value.split(',')));
                } else {
                    data.append(key, value);
                }
            });
            scannedReports.forEach(file => data.append("scannedReports", file));
            prescriptions.forEach(file => data.append("prescriptions", file));

            const res = await axios.post("http://localhost:5000/api/users", data);
            const userId = res.data.userId;

            navigate(`/view/${userId}`); // ✅ Redirect to the QR/profile page

        } catch (err) {
            console.error(err);
            alert("Error saving data");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-10 px-4">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8">
                <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">🩺 Digital Health Record Form</h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['name', 'age', 'gender', 'bloodGroup', 'phone', 'email', 'emergencyContact', 'address'].map((field) => (
                        <input
                            key={field}
                            name={field}
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            value={formData[field]}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                            required={['name', 'age', 'gender', 'bloodGroup'].includes(field)}
                        />
                    ))}

                    {["allergies", "chronicConditions", "medications", "pastSurgeries", "familyHistory", "mentalHealth", "vaccinations", "lastCheckup", "healthSummary"].map((field) => (
                        <textarea
                            key={field}
                            name={field}
                            placeholder={field.replace(/([A-Z])/g, ' $1')}
                            value={formData[field]}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 col-span-full"
                        />
                    ))}

                    <div className="col-span-full bg-gray-100 p-4 rounded-lg border border-gray-300">
                        <label className="block font-semibold text-gray-700 mb-2">📄 Upload Scanned Reports (PDF, JPG, PNG)</label>
                        <input
                            type="file"
                            multiple
                            onChange={(e) => handleFileChange(e, 'scannedReports')}
                            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>

                    <div className="col-span-full bg-gray-100 p-4 rounded-lg border border-gray-300">
                        <label className="block font-semibold text-gray-700 mb-2">📝 Upload Prescriptions (Optional)</label>
                        <input
                            type="file"
                            multiple
                            onChange={(e) => handleFileChange(e, 'prescriptions')}
                            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>

                    <button
                        type="submit"
                        className="col-span-full w-full bg-black text-white font-semibold py-3 rounded-xl shadow-md hover:bg-gray-900 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 ease-in-out"
                    >
                        🚀 Submit & Generate QR
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserForm;
