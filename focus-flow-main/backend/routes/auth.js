const express = require('express');
const rateLimit = require('express-rate-limit');
const { supabase } = require('../middleware/auth');

const router = express.Router();

// Define the rate limit rule: max 5 requests per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, 
  message: { error: 'Too many authentication attempts from this IP, please try again after 15 minutes' },
  standardHeaders: true, 
  legacyHeaders: false, 
});

/**
 * POST /api/auth/login
 * Authenticates user credentials via Supabase. Protected by rate limiting.
 */
router.post('/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      return res.status(401).json({ error: error.message });
    }

    res.json({ success: true, session: data.session });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

/**
 * POST /api/auth/register
 * Registers a new user via Supabase. Protected by rate limiting.
 */
router.post('/register', authLimiter, async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Email, password, and username are required' });
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ success: true, user: data.user, message: 'Registration successful' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

module.exports = router;
