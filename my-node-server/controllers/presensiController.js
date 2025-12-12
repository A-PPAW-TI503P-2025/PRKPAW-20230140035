const { Presensi, User } = require("../models");
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";
const multer = require('multer');
const path = require('path');
const { Op } = require('sequelize');

// --- Multer Configuration ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Pastikan folder 'uploads/' ada di root proyek backend
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    // req.user sudah tersedia karena middleware authenticateToken dipanggil duluan
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}-${Date.now()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
  }
};

exports.upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } 
});

// --- Controller Functions ---

exports.CheckIn = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();
    const { latitude, longitude } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: "Bukti foto wajib diunggah untuk Check-in." });
    }

    // Mengganti backslash menjadi forward slash agar path konsisten di berbagai OS
    const buktiFoto = req.file.path.replace(/\\/g, '/'); 

    const existingRecord = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (existingRecord) {
      return res
        .status(400)
        .json({ message: "Anda sudah melakukan check-in dan belum check-out." });
    }
    
    const newRecord = await Presensi.create({
      userId: userId,
      checkIn: waktuSekarang,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      buktiFoto: buktiFoto,
    });

    res.status(201).json({
      message: `Halo ${userName}, check-in Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: newRecord,
    });
  } catch (error) {
    console.error("Error during CheckIn:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server saat check-in.", error: error.message });
  }
};

exports.CheckOut = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();

    const recordToUpdate = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (!recordToUpdate) {
      return res.status(404).json({
        message: "Tidak ditemukan catatan check-in yang aktif untuk Anda.",
      });
    }

    recordToUpdate.checkOut = waktuSekarang;
    await recordToUpdate.save();

    res.json({
      message: `Selamat jalan ${userName}, check-out Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: recordToUpdate,
    });
  } catch (error) {
    console.error("Error during CheckOut:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server saat check-out", error: error.message });
  }
};


// --- FUNGSI BARU: LAPORAN ADMIN ---
exports.getAllPresensiAdmin = async (req, res) => {
    try {
        const { nama, startDate, endDate } = req.query; 
        
        const whereClause = {};
        
        if (nama) {
            whereClause['$user.nama$'] = { [Op.like]: `%${nama}%` };
        }

        if (startDate || endDate) {
            whereClause.checkIn = {};
            if (startDate) {
                whereClause.checkIn[Op.gte] = new Date(startDate); 
            }
            if (endDate) {
                const endDay = new Date(endDate);
                endDay.setDate(endDay.getDate() + 1);
                whereClause.checkIn[Op.lt] = endDay;
            }
        }

        const reports = await Presensi.findAll({
            where: whereClause,
            include: [{ 
                model: User, 
                as: 'user', 
                attributes: ['nama'], 
            }],
            order: [['checkIn', 'DESC']]
        });

        // Format data sebelum dikirim ke frontend
        const formattedReports = reports.map(report => ({
            id: report.id,
            nama: report.user ? report.user.nama : 'User Dihapus',
            checkIn: report.checkIn ? format(report.checkIn, 'yyyy-MM-dd HH:mm:ss', { timeZone }) : null,
            checkOut: report.checkOut ? format(report.checkOut, 'yyyy-MM-dd HH:mm:ss', { timeZone }) : null,
            latitude: report.latitude,
            longitude: report.longitude,
            buktiFoto: report.buktiFoto
        }));

        res.json(formattedReports);
    } catch (error) {
        console.error("Error saat mengambil laporan admin:", error);
        res.status(500).json({ message: "Gagal mengambil laporan presensi.", error: error.message });
    }
};

// ... (exports.deletePresensi)

exports.deletePresensi = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const presensiId = req.params.id;
    const recordToDelete = await Presensi.findByPk(presensiId);

    if (!recordToDelete) {
      return res
        .status(404)
        .json({ message: "Catatan presensi tidak ditemukan." });
    }
    // Asumsi: Hanya admin yang boleh menghapus semua data, atau user hanya boleh menghapus datanya sendiri.
    // Jika Anda ingin Admin bisa menghapus semua, hapus kondisi di bawah dan tambahkan isAdmin middleware di route.
    if (recordToDelete.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Akses ditolak: Anda bukan pemilik catatan ini." });
    }
    await recordToDelete.destroy();
    res.status(200).json({ message: "Data berhasil dihapus" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// ... (exports.updatePresensi)

exports.updatePresensi = async (req, res) => {
  try {
    const presensiId = req.params.id;

    const { checkIn, checkOut } = req.body;

    if (checkIn === undefined && checkOut === undefined) {
      return res.status(400).json({
        message:
          "Request body tidak berisi data yang valid untuk diupdate (checkIn atau checkOut).",
      });
    }

    const recordToUpdate = await Presensi.findByPk(presensiId);

    if (!recordToUpdate) {
      return res
        .status(404)
        .json({ message: "Catatan presensi tidak ditemukan." });
    }

    recordToUpdate.checkIn = checkIn || recordToUpdate.checkIn;
    recordToUpdate.checkOut = checkOut || recordToUpdate.checkOut;
    
    await recordToUpdate.save();

    res.json({
      message: "Data presensi berhasil diperbarui.",
      data: recordToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};