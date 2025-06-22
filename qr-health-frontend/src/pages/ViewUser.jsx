import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import QRCode from 'react-qr-code';
import { toPng } from 'html-to-image';
import download from 'downloadjs';

const ViewUser = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const qrRef = useRef(null);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://qrhealth.onrender.com';
                const res = await axios.get(`${BASE_URL}/api/users/${id}`);
                setUser(res.data);
            } catch (err) {
                console.error('Error fetching user:', err);
            }
        };
        fetchUser();
    }, [id]);



    const handleDownloadQR = () => {
        toPng(qrRef.current)
            .then((dataUrl) => {
                download(dataUrl, `${user.name || 'user'}-qr.png`);
            })
            .catch((err) => {
                console.error('QR download failed:', err);
            });
    };

    if (!user) return <div className="text-center p-10">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 flex flex-col items-center">
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">👤 {user.name}'s Health Summary</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(user).map(
                        ([key, value]) =>
                            key !== '_id' &&
                            key !== 'scannedReports' &&
                            key !== 'prescriptions' && (
                                <div key={key} className="p-4 bg-gray-100 rounded-lg">
                                    <p className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}:</p>
                                    <p className="text-gray-700 break-words">
                                        {Array.isArray(value) ? value.join(', ') : value || 'N/A'}
                                    </p>
                                </div>
                            )
                    )}
                </div>

                <div className="mt-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">📎 Uploaded Files</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user.scannedReports?.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-gray-700">Scanned Reports:</h3>
                                <ul className="list-disc pl-5">
                                    {user.scannedReports.map((url, idx) => (
                                        <li key={idx}>
                                            <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                                                View Report {idx + 1}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {user.prescriptions?.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-gray-700">Prescriptions:</h3>
                                <ul className="list-disc pl-5">
                                    {user.prescriptions.map((url, idx) => (
                                        <li key={idx}>
                                            <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                                                View Prescription {idx + 1}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-10 flex flex-col items-center">
                    <h3 className="text-xl font-bold mb-2">📱 QR Code</h3>
                    <div ref={qrRef} className="bg-white p-4 rounded-lg shadow-md">
                        <QRCode value={`https://your-frontend.vercel.app/view/${user._id}`}
                            size={128} />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Scan to view this profile</p>

                    {/* ✅ Download QR Button */}
                    <button
                        onClick={handleDownloadQR}
                        className="mt-4 bg-black text-black px-4 py-2 rounded-md hover:bg-gray-800 transition"
                    >
                        ⬇️ Download QR
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewUser;
