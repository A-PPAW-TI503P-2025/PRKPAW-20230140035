import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// Gunakan metode manual decoding dari kode perbaikan sebelumnya
// Jika Anda sudah menginstal 'jwt-decode', ganti dengan: import { jwtDecode } from 'jwt-decode';

function DashboardPage() {
  // useNavigate ASLI kini digunakan di sini:
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Pengguna');
  const [userRole, setUserRole] = useState('Mahasiswa');

  // Definisi warna pastel
  const pastel = {
    bgLight: 'bg-pink-50',
    bgCard: 'bg-white',
    primaryBlue: 'text-sky-600',
    primaryBorder: 'border-sky-400',
    secondaryPink: 'text-rose-500',
    secondaryBorder: 'border-rose-400',
    textDark: 'text-gray-800',
    textMedium: 'text-gray-600',
    shadowHover: 'hover:shadow-sky-300/50',
    logoutBtn: 'bg-red-300 hover:bg-red-400 focus:ring-red-300',
  };
  
    // Fungsi Logout sesuai logika lama Anda
   const handleLogout = useCallback(() => {
    localStorage.removeItem('token'); 
    navigate('/login'); 
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Metode Manual Decoding JWT
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = JSON.parse(window.atob(base64)); 

        setUserName(decoded.nama || 'Pengguna');
        setUserRole(decoded.role || 'Mahasiswa');
      } catch (error) {
        console.error("Gagal mendekode token:", error);
        handleLogout();
      }
    } else {
      handleLogout();
    }
  }, [handleLogout]);

  const attendanceData = {
    totalClasses: 18,
    attended: 16,
    missed: 2,
    details: [
      { course: 'Pemrograman Web', status: 'Hadir' },
      { course: 'Statistika', status: 'Terlambat' },
      { course: 'Fisika Dasar', status: 'Tidak Hadir' },
      { course: 'Algoritma', status: 'Hadir' },
    ],
  };

  // Komponen Pembantu Card
  const Card = ({ title, description, icon, accentColorClass }) => (
      <div 
        className={`p-6 rounded-xl shadow-lg ${pastel.bgCard} ${accentColorClass} bg-opacity-10 border border-gray-200 hover:shadow-sky-300/50 transition duration-300 transform hover:scale-[1.02]`}
      >
          <div className={`text-4xl mb-3 ${pastel.primaryBlue}`}>{icon}</div>
          <h3 className={`text-xl font-extrabold ${pastel.textDark} mb-2`}>{title}</h3>
          <p className={`${pastel.textMedium} text-sm font-light`}>{description}</p>
      </div>
  );

  const AttendanceSummary = ({ data }) => {
    const attendancePercentage = ((data.attended / data.totalClasses) * 100).toFixed(1);
    const progressColor = data.missed > 1 ? 'bg-rose-400' : 'bg-sky-400';
    const textColor = data.missed > 1 ? pastel.secondaryPink : pastel.primaryBlue;

    return (
      <div className={`mt-12 p-8 ${pastel.bgCard} rounded-2xl shadow-xl border-l-8 ${pastel.primaryBorder}`}>
        <h3 className={`text-3xl font-extrabold ${pastel.textDark} mb-6 border-b pb-2 border-sky-100 flex justify-between items-center`}>
          Ringkasan Presensi Mingguan
          <span className={`text-xl font-black ${textColor}`}>{attendancePercentage}%</span>
        </h3>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
          <div 
            className={`h-3 rounded-full ${progressColor}`} 
            style={{ width: `${attendancePercentage}%` }}
            aria-valuenow={attendancePercentage}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-3 text-center mb-6">
          <div>
            <p className={`text-3xl font-bold ${pastel.primaryBlue}`}>{data.attended}</p>
            <p className={`${pastel.textMedium} text-sm`}>Hadir</p>
          </div>
          <div>
            <p className={`text-3xl font-bold ${pastel.secondaryPink}`}>{data.missed}</p>
            <p className={`${pastel.textMedium} text-sm`}>Tidak Hadir</p>
          </div>
          <div>
            <p className={`text-3xl font-bold ${pastel.textDark}`}>{data.totalClasses}</p>
            <p className={`${pastel.textMedium} text-sm`}>Total Kelas</p>
          </div>
        </div>

        {/* Recent Attendance Status */}
        <h4 className={`text-xl font-semibold ${pastel.textDark} mb-3`}>4 Kehadiran Terakhir:</h4>
        <div className="grid grid-cols-2 gap-3">
          {data.details.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className={`text-sm ${pastel.textDark}`}>{item.course}</span>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                item.status === 'Hadir' ? 'bg-emerald-100 text-emerald-600' :
                item.status === 'Terlambat' ? 'bg-yellow-100 text-yellow-600' :
                'bg-rose-100 text-rose-600'
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // --- Fitur Khusus Admin ---
  const AdminFeatures = () => (
    <div className={`mt-12 p-8 ${pastel.bgCard} rounded-2xl shadow-xl border-l-8 border-purple-500`}>
        <h3 className={`text-3xl font-extrabold ${pastel.textDark} mb-6 border-b pb-2 border-purple-100 flex items-center`}>
          <span className="text-4xl mr-3">⚙️</span> Panel Administrator
        </h3>
        <p className={`${pastel.textMedium} mb-4`}>Kelola pengguna, mata kuliah, dan akses sistem di sini. Hanya dapat diakses oleh akun Admin.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="py-3 px-4 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition">Kelola Pengguna</button>
            <button className="py-3 px-4 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition">Atur Kelas</button>
            <button className="py-3 px-4 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition">Lihat Log Sistem</button>
        </div>

        <div className="mt-8">
             <h4 className={`text-xl font-semibold ${pastel.textDark} mb-3`}>Tabel Data Terbaru:</h4>
             {/* Placeholder Tabel Data */}
             <div className="p-4 bg-gray-50 rounded-lg text-gray-500 border border-gray-200 text-center">
                Data pengguna/sistem terbaru akan ditampilkan di sini.
             </div>
        </div>
    </div>
  );

  // --- Fitur Khusus Mahasiswa ---
  const MahasiswaFeatures = () => (
    <>
        <AttendanceSummary data={attendanceData} />
        
        <div className={`mt-12 p-8 ${pastel.bgCard} rounded-2xl shadow-xl border-l-8 border-emerald-500`}>
            <h3 className={`text-3xl font-extrabold ${pastel.textDark} mb-6 border-b pb-2 border-emerald-100 flex items-center`}>
              <span className="text-4xl mr-3">📑</span> Nilai & Jadwal
            </h3>
            <p className={`${pastel.textMedium} mb-4`}>Lihat detail nilai mata kuliah Anda untuk semester ini.</p>
            
            <ul className="space-y-3">
                <li className="p-3 bg-emerald-50 rounded-md border-l-4 border-emerald-400 flex justify-between items-center font-semibold">
                    <span>Pemrograman Web</span> 
                    <span className="text-lg text-emerald-700">A</span>
                </li>
                <li className="p-3 bg-emerald-50 rounded-md border-l-4 border-emerald-400 flex justify-between items-center font-semibold">
                    <span>Statistika</span> 
                    <span className="text-lg text-emerald-700">B+</span>
                </li>
                <li className="p-3 bg-emerald-50 rounded-md border-l-4 border-emerald-400 flex justify-between items-center font-semibold">
                    <span>Fisika Dasar</span> 
                    <span className="text-lg text-emerald-700">A-</span>
                </li>
            </ul>
        </div>
    </>
  );


  return (
    <div className={`min-h-screen ${pastel.bgLight} flex flex-col p-4 md:p-10 font-sans`}>
      
      {/* Header Bar */}
      <header className={`w-full ${pastel.bgCard} rounded-xl shadow-md border-b border-pink-200 sticky top-4 z-10`}>
        <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
            <h1 className={`text-3xl font-black ${pastel.primaryBlue} flex items-center`}>
              <span className="mr-2">🌸</span> Aplikasi Akademik 
            </h1>
            <div className="flex items-center space-x-4">
                <div className="text-right">
                    {/* Perbaikan: Menampilkan Nama User */}
                    <p className={`text-sm font-medium ${pastel.textMedium}`}>Selamat Datang,</p>
                    <p className={`text-lg font-extrabold ${pastel.textDark}`}>{userName}</p>
                </div>
                <button
                    onClick={handleLogout}
                    className={`py-2 px-6 ${pastel.logoutBtn} text-white font-bold rounded-full shadow-lg transition duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-pink-50`}
                >
                    Logout
                </button>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow w-full max-w-7xl mx-auto mt-8">
        
        {/* Welcome Banner */}
        <div className={`${pastel.bgCard} p-8 rounded-2xl shadow-xl border-l-8 ${pastel.secondaryBorder} mb-10`}>
            <p className={`text-5xl font-extrabold mb-2 ${pastel.secondaryPink}`}>
                Dashboard Utama
            </p>
            <p className={`text-xl ${pastel.textMedium}`}>
                Anda login sebagai <span className={`font-bold uppercase ${pastel.primaryBlue}`}>{userRole}</span>. Kelola informasi dan data Anda dengan mudah.
            </p>
        </div>

        {/* Info Cards (Global) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <Card 
              title="Mahasiswa Aktif" 
              description="Data statistik total mahasiswa terdaftar saat ini." 
              icon="💖" 
              accentColorClass="bg-rose-100/50 text-rose-500"
            />
            
            <Card 
              title="Mata Kuliah" 
              description="Daftar lengkap semua mata kuliah yang tersedia." 
              icon="📘" 
              accentColorClass="bg-sky-100/50 text-sky-500"
            />
            
            <Card 
              title="Dosen Pengajar" 
              description="Informasi kontak dan jadwal dosen pengajar." 
              icon="👩‍🏫" 
              accentColorClass="bg-emerald-100/50 text-emerald-500"
            />

            {/* Card Terakhir Diserahkan ke Fitur Spesifik */}
            {userRole.toLowerCase() === 'admin' ? (
                <Card 
                  title="Akses Administrator" 
                  description="Kelola hak akses, sistem, dan pengaturan pengguna." 
                  icon="🔑" 
                  accentColorClass="bg-purple-100/50 text-purple-500"
                />
            ) : (
                <Card 
                  title="Jadwal Kelas" 
                  description="Lihat jadwal perkuliahan Anda minggu ini." 
                  icon="📅" 
                  accentColorClass="bg-yellow-100/50 text-yellow-500"
                />
            )}
        </div>

        {/* --- KONTEN DINAMIS BERDASARKAN ROLE --- */}
        {userRole.toLowerCase() === 'admin' ? (
            <AdminFeatures />
        ) : (
            <MahasiswaFeatures />
        )}
        {/* ------------------------------------- */}


        {/* Recent Activity Section (Global) */}
        <div className="mt-12 p-8 bg-white rounded-2xl shadow-xl">
            <h3 className={`text-3xl font-extrabold ${pastel.textDark} mb-6 border-b pb-2 border-pink-100`}>
              Pemberitahuan & Aktivitas
            </h3>
            <ul className="space-y-4">
                <li className={`p-4 ${pastel.bgLight} rounded-lg shadow-sm border-l-4 border-rose-400 flex items-center`}>
                    <span className="text-xl mr-3">📣</span>
                    <span className={`${pastel.textMedium}`}>Pemberitahuan: Nilai Tugas Akhir telah dipublikasikan. Cek menu Nilai Anda.</span>
                </li>
                <li className={`p-4 bg-sky-50 rounded-lg shadow-sm border-l-4 border-sky-400 flex items-center`}>
                    <span className="text-xl mr-3">🗓️</span>
                    <span className={`${pastel.textMedium}`}>Jadwal baru tersedia untuk Semester Genap 2024. Pendaftaran dimulai besok.</span>
                </li>
            </ul>
        </div>

      </div>
      
      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto mt-10 p-4 text-center">
        <p className={`text-sm ${pastel.textMedium}`}>
          © 2025 Aplikasi Akademik. Didesain dengan kelembutan.
        </p>
      </footer>

    </div>
  );
}
export default DashboardPage;