// <--- 1. IMPOR MODEL ANDA
// Pastikan Anda mengimpor model dari database
// Sesuaikan nama 'Presensi' jika nama file model Anda berbeda
const { Presensi } = require('../models');
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama, tanggalMulai, tanggalSelesai } = req.query;

    let options = { where: {} };
    
     if (nama) {
      options.where.nama = {
        [Op.like]: `%${nama}%`,
      };
    }

    if (tanggalMulai && tanggalSelesai) {
      options.where.checkIn = {
        [Op.between]: [new Date(tanggalMulai), new Date(tanggalSelesai)],
      };
    } else if (tanggalMulai) {
      options.where.checkIn = {
        [Op.gte]: new Date(tanggalMulai),
      };
    } else if (tanggalSelesai) {
      options.where.checkIn = {
        [Op.lte]: new Date(tanggalSelesai),
      };
    }

    const records = await Presensi.findAll(options);

    res.json({
      reportDate: new Date().toLocaleDateString("id-ID"),
      filter: { nama, tanggalMulai, tanggalSelesai },
      data: records,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil laporan", error: error.message });
  }
};
