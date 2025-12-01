import { NextRequest, NextResponse } from 'next/server';
import { destroySession, extractTokenFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Extract token from request
    const token = extractTokenFromRequest(request);

    // Destroy session if token exists
    if (token) {
      destroySession(token);
    }

    // Clear session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    response.cookies.set('admin_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}