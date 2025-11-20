import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const pastel = {
    bgLight: 'bg-pink-50',
    bgCard: 'bg-white',
    primaryBlue: 'text-sky-600',
    primaryBorder: 'border-sky-40    0',
    secondaryPink: 'text-rose-500',
    textDark: 'text-gray-800',
    textMedium: 'text-gray-600',
    submitGradient: 'bg-gradient-to-r from-rose-400 to-fuchsia-500 hover:from-rose-500 hover:to-fuchsia-600',
    errorBg: 'bg-rose-100',
    successBg: 'bg-emerald-100',
    errorText: 'text-rose-700',
    successText: 'text-emerald-700',
};

// Component InputField yang diselaraskan
const InputField = ({ id, label, type, value, onChange, icon, children }) => (
    <div className="relative">
        <label htmlFor={id} className={`block text-sm font-bold ${pastel.textDark} mb-1`}>
            {label}
        </label>
        {/* Styling input field yang ditingkatkan untuk kerapian dan estetika: shadow, border, dan hover effect */}
        <div className="flex items-center bg-white rounded-xl shadow-md border border-gray-300 focus-within:ring-4 focus-within:ring-sky-300 transition duration-300 transform hover:shadow-lg hover:border-sky-400">
            {icon && <span className={`p-3 text-2xl ${pastel.primaryBlue}`}>{icon}</span>}
            {type === 'select' ? (
                <select
                    id={id}
                    value={value}
                    onChange={onChange}
                    required
                    className={`flex-grow px-3 py-3 bg-transparent border-none focus:outline-none ${pastel.textDark}`}
                >
                    {children}
                </select>
            ) : (
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    required
                    className={`flex-grow px-3 py-3 bg-transparent border-none focus:outline-none ${pastel.textDark} placeholder-gray-400`}
                    placeholder={`Masukkan ${label.toLowerCase()}...`}
                />
            )}
        </div>
    </div>
);


function RegisterPage() {
    // State dari kode yang Anda berikan
    const [nama, setNama] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('mahasiswa');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            await axios.post('http://localhost:3001/api/auth/register', {
                nama, email, password, role
            });

            setSuccess('Pendaftaran berhasil! Mengarahkan ke halaman login...');
            
            setTimeout(() => {
                navigate('/login'); 
            }, 2000);

        } catch (err) {
            setError(err.response ? err.response.data.message : 'Registrasi gagal. Cek koneksi server atau input Anda.');
        }
    };

    return (
        <div className={`min-h-screen ${pastel.bgLight} flex flex-col items-center justify-center p-4 font-sans`}>
            {/* Container Card disesuaikan dengan tema Dashboard */}
            <div className={`
                ${pastel.bgCard} p-10 rounded-3xl shadow-2xl w-full max-w-md 
                transform transition-transform duration-500 
                border-t-8 border-rose-400 relative
                hover:shadow-3xl hover:shadow-rose-300/60
            `}>
                {/* Header Estetik */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-rose-400 p-4 rounded-full shadow-lg text-4xl transform rotate-3">
                    <span className="text-white">🎓</span>
                </div>

                <h2 className={`text-4xl font-extrabold text-center mt-6 mb-1 ${pastel.secondaryPink}`}>
                    Buat Akun Baru
                </h2>
                <p className={`text-center ${pastel.textMedium} mb-8 text-md border-b pb-4 border-sky-100`}>
                    Daftar dan mulai kelola data akademik Anda.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6"> 
                    
                    <InputField 
                        id="nama" 
                        label="Nama Lengkap" 
                        type="text" 
                        value={nama} 
                        onChange={(e) => setNama(e.target.value)} 
                        icon="👤" 
                    />
                    <InputField 
                        id="email" 
                        label="Alamat Email (Login ID)" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        icon="📧" 
                    />
                    <InputField 
                        id="password" 
                        label="Kata Sandi" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        icon="🔐" 
                    />
                    {/* Dropdown Role menggunakan InputField dengan tipe 'select' */}
                    <InputField 
                        id="role" 
                        label="Peran Anda" 
                        type="select" 
                        value={role} 
                        onChange={(e) => setRole(e.target.value)} 
                        icon="💼" 
                    >
                        <option value="mahasiswa">Mahasiswa</option>
                        <option value="admin">Admin</option>
                    </InputField>
                    
                    {/* Tombol dengan gradient dan efek hover yang kuat */}
                    <button
                        type="submit"
                        className={`w-full py-4 px-4 ${pastel.submitGradient} text-white font-bold text-xl rounded-xl shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-fuchsia-400 focus:ring-opacity-75 relative overflow-hidden transform hover:scale-[1.03]`}
                    >
                        Daftar Akun 🎉
                    </button>
                </form>
                
                {/* Notifikasi Error dan Success diselaraskan dengan pastel */}
                {error && (
                    <p className={`${pastel.errorText} ${pastel.errorBg} text-base mt-6 p-3 rounded-xl text-center font-medium border-l-4 border-rose-400 shadow-inner`}>{error}</p>
                )}
                 {success && (
                    <p className={`${pastel.successText} ${pastel.successBg} text-base mt-6 p-3 rounded-xl text-center font-medium border-l-4 border-emerald-400 shadow-inner`}>{success}</p>
                )}
                
                <p className={`mt-8 text-center text-base ${pastel.textMedium}`}>
                    Sudah punya akun? 
                    <Link to="/login" className={`font-extrabold ${pastel.secondaryPink} hover:text-sky-600 ml-1 transition duration-300`}>
                        Masuk di sini!
                    </Link>
                </p>
            </div>
        </div>
    );
}
export default RegisterPage;