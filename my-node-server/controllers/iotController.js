exports.testConnection = (req, res) => {
  const { message, deviceId } = req.body;
  console.log(`📡 [IOT] Pesan dari ${deviceId}: ${message}`);
  res.status(200).json({ status: "ok", reply: "Server menerima koneksi!" });
};

const { SensorLog } = require('../models'); 
exports.receiveSensorData = async (req, res) => {
  try {
    const { suhu, kelembaban, cahaya } = req.body;

    if (suhu === undefined || kelembaban === undefined) {
      return res.status(400).json({ 
        status: "error", 
        message: "Data suhu atau kelembaban tidak valid" 
      });
    }

    const newData = await SensorLog.create({
      suhu: parseFloat(suhu),
      kelembaban: parseFloat(kelembaban),
      cahaya: parseInt(cahaya) || 0 
    });

    console.log(`💾 [SAVED] Suhu: ${suhu}°C | Lembab: ${kelembaban}% | Cahaya: ${cahaya}`);

    res.status(201).json({ status: "ok", message: "Data berhasil disimpan" });

  } catch (error) {
    console.error("Gagal menyimpan data:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

