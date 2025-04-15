const express = require('express');
const bodyParser = require('body-parser');
const { expressjwt } = require('express-jwt');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../frontend/dist/frontend')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/frontend/index.html'));
});

// Hardcoded credentials for testing
const USERNAME = 'aleeza';
const PASSWORD = 'cabahug';
const SECRET_KEY = 'aleeza'; // Replace with a secure key in production

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB (if needed)
mongoose.connect('mongodb://localhost:27017/a14final');
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Login route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (username === USERNAME && password === PASSWORD) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Protected route
app.get('/api/dashboard', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    res.json({ message: `Welcome to the dashboard, ${user.username}!` });
  });
});

// Serve static files (if needed)
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});