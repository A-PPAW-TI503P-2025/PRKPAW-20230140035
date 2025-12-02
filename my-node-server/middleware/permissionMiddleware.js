const jwt = require("jsonwebtoken");

exports.addUserData = (req, res, next) => {
    // Ambil Secret Key di sini untuk memastikan process.env sudah dimuat.
    const JWT_SECRET = process.env.JWT_SECRET; 
    
    // Cek fatal: pastikan Secret Key terisi (hanya untuk debugging)
    if (!JWT_SECRET) {
        console.error("FATAL: JWT_SECRET tidak dimuat!");
        return res.status(500).json({ 
            message: "Konfigurasi server error: JWT_SECRET tidak ditemukan." 
        });
    }

    // 1. Ambil header Authorization
    const authHeader = req.headers["authorization"]; 

    // 2. Cek apakah format Bearer Token benar
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ message: "Akses ditolak. Token tidak disediakan atau format salah." });
    }

    // 3. 🚨 PERBAIKAN: Ekstrak token dengan .slice(7) dan .trim()
    // .slice(7) mengambil semua karakter setelah "Bearer " (7 karakter)
    const token = authHeader.slice(7).trim(); 

    if (!token) {
        return res
            .status(401)
            .json({ message: "Akses ditolak. Token kosong." });
    }

    jwt.verify(token, JWT_SECRET, (err, userPayload) => {
        if (err) {
            // Jika ini gagal, berarti:
            // a) Token kedaluwarsa (paling sering)
            // b) Token dibuat dengan Secret Key yang berbeda
            console.error("JWT VERIFICATION FAILED:", err.message);
            return res
                .status(403)
                .json({ message: "Token tidak valid atau kedaluwarsa." });
        }
        
        req.user = userPayload;
        next();
    });
};

exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res
            .status(403)
            .json({ message: "Akses ditolak. Hanya untuk admin." });
    }
};