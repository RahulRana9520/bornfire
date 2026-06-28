const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Create a Supabase client using the Service Role Key.
// WARNING: This bypasses Row Level Security (RLS) policies completely.
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware to authenticate JWT token from Supabase
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    // Verify the JWT token by fetching the user associated with it
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // Attach the authenticated user to the request object
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
};

module.exports = {
  supabase,
  authenticateToken
};
