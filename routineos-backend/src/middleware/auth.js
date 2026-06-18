const supabase = require('../config/supabase');
const { sendError } = require('../utils/responseHelper');

/**
 * Validates the Bearer token from Supabase Auth and attaches user to req
 */
async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Missing or invalid authorization header', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return sendError(res, 'Invalid or expired token', 401);
    }

    // Attach full user profile from users table
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      return sendError(res, 'Failed to fetch user profile', 500);
    }

    req.user = {
      id: user.id,
      email: user.email,
      ...profile,
    };

    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return sendError(res, 'Authentication failed', 401);
  }
}

module.exports = { authenticate };