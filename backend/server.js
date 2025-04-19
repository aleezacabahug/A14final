const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Hardcoded secret key for JWT
const SECRET_KEY = 'aleeza'; // Replace with a secure key in production

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/a14final');
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Define Mongoose schema and model for users
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store hashed passwords
});

const User = mongoose.model('User', userSchema);

// Seed the database with a default user (if not already present)
const seedUser = async () => {
  const existingUser = await User.findOne({ username: 'aleeza' });
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('cabahug', 10);
    const user = new User({ username: 'aleeza', password: hashedPassword });
    await user.save();
    console.log('Default user seeded');
  }
};
seedUser();

// Serve Angular static files from the correct build output
app.use(express.static(path.join(__dirname, '../frontend/dist/frontend/browser')));

// Serve the main index.html on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/frontend/browser/index.csr.html'));
});

// Login route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user in the database
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
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

// Serve static files (optional)
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});