const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// Hardcoded credentials for testing
const USERNAME = 'aleez';
const PASSWORD = 'aleez';
const SECRET_KEY = 'your_jwt_secret_key'; // Replace with a secure key in production

// Middleware
app.use(cors());
app.use(bodyParser.json());

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});