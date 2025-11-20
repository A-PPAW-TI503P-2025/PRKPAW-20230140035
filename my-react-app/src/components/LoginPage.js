import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; 

const pastel = {
    bgLight: 'bg-pink-50',
    bgCard: 'bg-white',
    primaryBlue: 'text-sky-600',
    primaryBorder: 'border-sky-400',
    secondaryPink: 'text-rose-500',
    textDark: 'text-gray-800',
    textMedium: 'text-gray-600',
    submitGradient: 'bg-gradient-to-r from-rose-400 to-fuchsia-500 hover:from-rose-500 hover:to-fuchsia-600',
    errorBg: 'bg-rose-100',
    errorText: 'text-rose-700',
};

const InputField = ({ id, label, type, value, onChange, icon }) => (
    <div className="relative">
        <label htmlFor={id} className={`block text-sm font-bold ${pastel.textDark} mb-1`}>
            {label}
        </label>
        {}
        <div className="flex items-center bg-white rounded-xl shadow-md border border-gray-300 focus-within:ring-4 focus-within:ring-sky-300 transition duration-300 transform hover:shadow-lg hover:border-sky-400">
            <span className={`p-3 text-2xl ${pastel.primaryBlue}`}>{icon}</span>
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                required
                className={`flex-grow px-3 py-3 bg-transparent border-none focus:outline-none ${pastel.textDark} placeholder-gray-400`}
                placeholder={`Masukkan ${label.toLowerCase()}...`}
            />
        </div>
    </div>
);

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(null); 

    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email: email,
        password: password
      });

      const token = response.data.token;
      localStorage.setItem('token', token); 

      navigate('/dashboard');

    } catch (err) {
      setError(err.response ? err.response.data.message : 'Hmm, email atau kata sandi salah nih. Coba lagi ya!');
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
        {/* Header Icon Estetik */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-rose-400 p-4 rounded-full shadow-lg text-4xl transform -rotate-6">
            <span className="text-white">🔐</span>
        </div>
        
        <h2 className={`text-4xl font-extrabold text-center mt-6 mb-2 ${pastel.secondaryPink}`}>
          Selamat Datang!
        </h2>
        <p className={`text-center ${pastel.textMedium} mb-8 pb-4 border-b border-sky-100`}>
            Masuk untuk melanjutkan aktivitas akademik Anda.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField 
            id="email" 
            label="Alamat Email" 
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
            icon="🔑" 
          />
          
          <button
            type="submit"
            className={`w-full py-4 px-4 ${pastel.submitGradient} text-white font-bold text-xl rounded-xl shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-fuchsia-400 focus:ring-opacity-75 relative overflow-hidden transform hover:scale-[1.02]`}
          >
            <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 hover:opacity-20 transition-opacity duration-300"></span>
            Masuk Sekarang ✨
          </button>
        </form>
        
        {error && (
          <p className={`${pastel.errorText} ${pastel.errorBg} text-base mt-6 p-3 rounded-xl text-center font-medium border-l-4 border-rose-400 shadow-inner`}>
            {error}
          </p>
        )}
        
        <p className={`mt-8 text-center text-base ${pastel.textMedium}`}>
          Belum punya akun? 
          <Link to="/register" className={`font-extrabold ${pastel.primaryBlue} hover:text-rose-500 ml-1 transition duration-300`}>
            Daftar di sini!
          </Link>
        </p>
      </div>
    </div>
  );
}
export default LoginPage;