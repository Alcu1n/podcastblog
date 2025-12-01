import crypto from 'crypto';

// Admin credentials (in production, these should be in environment variables)
const ADMIN_EMAIL = 'alcuin.ch@gmail.com';
const ADMIN_PASSWORD_HASH = crypto.createHash('sha256').update('Zmksdwdwd043..').digest('hex');

// Session management
const SESSION_TOKEN_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

// Session storage (in production, use Redis or database)
const sessions = new Map<string, { timestamp: number }>();

// Generate secure session token
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Verify admin credentials
export function verifyAdminCredentials(email: string, password: string): boolean {
  const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
  return email === ADMIN_EMAIL && passwordHash === ADMIN_PASSWORD_HASH;
}

// Create admin session
export function createAdminSession(): { token: string; expiresAt: Date } {
  const token = generateSessionToken();
  const timestamp = Date.now();
  const expiresAt = new Date(timestamp + SESSION_TIMEOUT);

  sessions.set(token, { timestamp });

  // Clean up expired sessions
  cleanupExpiredSessions();

  return { token, expiresAt };
}

// Verify session token
export function verifySessionToken(token: string): boolean {
  const session = sessions.get(token);

  if (!session) {
    return false;
  }

  const now = Date.now();
  if (now - session.timestamp > SESSION_TIMEOUT) {
    sessions.delete(token);
    return false;
  }

  // Refresh session timestamp
  session.timestamp = now;
  return true;
}

// Destroy session
export function destroySession(token: string): void {
  sessions.delete(token);
}

// Clean up expired sessions
function cleanupExpiredSessions(): void {
  const now = Date.now();
  for (const [token, session] of sessions.entries()) {
    if (now - session.timestamp > SESSION_TIMEOUT) {
      sessions.delete(token);
    }
  }
}

// Get session expiration time
export function getSessionExpiration(token: string): Date | null {
  const session = sessions.get(token);
  if (!session) return null;

  return new Date(session.timestamp + SESSION_TIMEOUT);
}

// Helper function to get token from request headers
export function extractTokenFromRequest(request: Request): string | null {
  // Check Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check cookies
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map(c => c.trim());
    const sessionCookie = cookies.find(c => c.startsWith('admin_session='));
    if (sessionCookie) {
      return sessionCookie.substring('admin_session='.length);
    }
  }

  return null;
}

// API route protection middleware
export function requireAuth(request: Request): Response | null {
  const token = extractTokenFromRequest(request);

  if (!token || !verifySessionToken(token)) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  return null;
}