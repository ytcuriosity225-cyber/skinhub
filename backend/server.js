const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 8080;
const SERVICE_NAME = process.env.SERVICE_NAME || 'skinhub-backend';

// Configure allowed origins from environment (comma-separated) or allow all by default
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim())
  : ['*'];

// Middleware: allow all origins explicitly when '*' is present, otherwise restrict to the list
if (allowedOrigins.length === 1 && allowedOrigins[0] === '*') {
  app.use(cors()); // allow all origins
} else {
  app.use(cors({
    origin: allowedOrigins,
    credentials: true
  }));
}
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api', apiRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({ status: 'SkinHub API is running', version: '1.0.0' });
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend Server running on port ${PORT}`);
  console.log(`ℹ️ Service Name: ${SERVICE_NAME}`);
  console.log(`ℹ️ CORS allowed origins: ${allowedOrigins.join(',')}`);
});
