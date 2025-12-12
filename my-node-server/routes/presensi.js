const express = require('express');
const router = express.Router();

const presensiController = require('../controllers/presensiController');
const { authenticateToken, isAdmin } = require('../middleware/permissionMiddleware');
const { body, validationResult } = require('express-validator');

// =========================
// ROUTES UNTUK PRESENSI
// =========================

// Semua endpoint presensi wajib login (token)
router.use(authenticateToken);

// LAPORAN ADMIN (Memerlukan hak akses admin)
router.get(
    '/reports/admin',
    isAdmin, 
    presensiController.getAllPresensiAdmin
);

// CHECK-IN
router.post(
  '/check-in',
  presensiController.upload.single("image"), // Nama field harus "image"
  presensiController.CheckIn
);
// CHECK-OUT
router.post('/check-out', presensiController.CheckOut);

// UPDATE PRESENSI (Hanya bisa diakses admin jika Anda menambahkan isAdmin di sini)
router.put(
  '/:id',
  [
    body('checkIn')
      .optional()
      .isISO8601()
      .withMessage('checkIn harus berupa format tanggal yang valid'),
    body('checkOut')
      .optional()
      .isISO8601()
      .withMessage('checkOut harus berupa format tanggal yang valid'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validasi gagal',
        errors: errors.array(),
      });
    }
    next();
  },
  presensiController.updatePresensi
);

// DELETE PRESENSI
router.delete('/:id', presensiController.deletePresensi);

module.exports = router;