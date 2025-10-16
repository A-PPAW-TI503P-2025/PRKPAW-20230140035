const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;
const bookRoutes = require('./routes/books');

// 🟢 Middleware utama
app.use(cors());
app.use(express.json());

// 🟢 Middleware logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log('[${timestamp}] ${req.method} ${req.url}');
  next();
});

// 🟢 Routing
app.use('/api/books', bookRoutes);

// 🟠 404 Handler (Not Found)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// 🔴 Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// 🟢 Jalankan server
app.listen(PORT, () => {
console.log(`Server running at http://localhost:${PORT}/`);
});