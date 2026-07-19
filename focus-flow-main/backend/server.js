const express = require('express');
const cors = require('cors');
require('dotenv').config();
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); // Includes /login and /register with rate limiting
app.use('/api', apiRoutes);       // Protected routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Bornfire Backend is running securely' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Bornfire Backend Server running on port ${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}/health`);
});
