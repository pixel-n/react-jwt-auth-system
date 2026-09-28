// Load environment variables from .env file before anything else
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

// Use PORT and JWT_SECRET from environment variables, with fallback defaults
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'default_fallback_secret';

// Enable CORS so your React frontend (e.g. http://localhost:5173) can make request calls
app.use(cors());

// Parse incoming requests with JSON payloads
app.use(express.json());

// In-memory array acting as a temporary database for users
const users = [];
//  HEALTH CHECK ROUTE
app.get('/', (req, res) => {
  res.send('Backend API is running successfully!');
});

//  REGISTER API
// Endpoint to register a new user
app.post('/api/register', (req, res) => {
  const { email, password } = req.body;

  // Validate that both email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Check if user already exists in memory
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Save new user credentials to memory
  users.push({ email, password });
  return res.status(201).json({ message: 'User registered successfully!' });
});
// LOGIN API
// Verifies user credentials and generates a signed JWT token
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Check if credentials match any registered user
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Generate a real JWT token signed with JWT_SECRET that expires in 1 hour
  const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });

  // Return generated JWT token to frontend
  return res.json({ message: 'Login successful', token });
});

// MIDDLEWARE: AUTHENTICATE TOKEN
// Intercepts requests to protected routes and verifies the JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Extract token from "Bearer <TOKEN>" header format
  const token = authHeader && authHeader.split(' ')[1];

  // Block access if no token is provided in the headers
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Verify token signature against JWT_SECRET
  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }
    // Attach decoded user payload (email) to the request object
    req.user = decodedUser;
    next(); // Pass control to the next route handler
  });
};
// PROTECTED DASHBOARD API
// Route protected by authenticateToken middleware
app.get('/api/dashboard', authenticateToken, (req, res) => {
  res.json({
    message: 'Welcome to the protected Dashboard!',
    user: req.user,
    secretData: 'Protected backend data accessed via valid JWT token.',
  });
});
// START SERVER
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});