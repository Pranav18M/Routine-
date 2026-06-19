const supabase = require('../config/supabase');
const { sendSuccess, sendError } = require('../utils/responseHelper');

/**
 * POST /api/auth/signup
 * Creates a new user with email + password
 */
async function signup(req, res, next) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }
    if (password.length < 8) {
      return sendError(res, 'Password must be at least 8 characters', 400);
    }

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      console.error('Supabase createUser error:', authError.message, authError.status);
      const msg = authError.message.toLowerCase();
      if (msg.includes('already') || msg.includes('registered') || msg.includes('exists')) {
        return sendError(res, 'An account with this email already exists. Try signing in instead.', 409);
      }
      return sendError(res, authError.message, 400);
    }

    // Create user profile row
    const { error: profileError } = await supabase.from('users').insert({
      id: authData.user.id,
      email,
      name: name || null,
    });

    if (profileError) {
      console.error('Profile creation failed:', profileError);
    }

    return sendSuccess(res, { userId: authData.user.id }, 'Account created successfully', 201);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 * Signs in with email + password, returns session tokens
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return sendError(res, 'Invalid email or password', 401);
    }

    return sendSuccess(res, {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    }, 'Login successful');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/refresh
 * Refreshes an expired access token
 */
async function refreshToken(req, res, next) {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return sendError(res, 'Refresh token is required', 400);
    }

    const { data, error } = await supabase.auth.refreshSession({ refresh_token: token });

    if (error) {
      return sendError(res, 'Invalid or expired refresh token', 401);
    }

    return sendSuccess(res, {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at,
    }, 'Token refreshed');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/logout
 */
async function logout(req, res, next) {
  try {
    // Client should discard tokens — server-side invalidation via Supabase admin
    await supabase.auth.admin.signOut(req.user.id);
    return sendSuccess(res, null, 'Logged out successfully');
  } catch (err) {
    // Logout should not fail visibly to user
    return sendSuccess(res, null, 'Logged out');
  }
}

module.exports = { signup, login, refreshToken, logout };