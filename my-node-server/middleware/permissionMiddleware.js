const jwt = require('jsonwebtoken'); 
// KUNCI RAHASIA HARUS SAMA PERSIS DENGAN YANG ADA DI authController.js
const JWT_SECRET = 'INI_ADALAH_KUNCI_RAHASIA_ANDA_YANG_SANGAT_AMAN'; 

/**
 * Middleware untuk memverifikasi JWT dan otentikasi user.
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => { 
        if (err) {
            return res.status(403).json({ message: 'Token tidak valid atau kadaluarsa.' });
        }
        
        req.user = user;
        next(); 
    });
};

/**
 * Middleware untuk memverifikasi apakah user memiliki role 'admin'.
 */
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ mJessage: 'Akses ditolak. Diperlukan hak akses Admin.' });
    }
};

module.exports = {
    authenticateToken,
    isAdmin, 
};