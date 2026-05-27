import { NextRequest, NextResponse } from 'next/server';
import { User } from '../../../../lib/models/User';
import { generateTokens, verifyRefreshToken } from '../../../../lib/jwt';
import { withDatabase, withCors } from '../../../../lib/middleware';

async function refreshHandler(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: 'Refresh token required' },
        { status: 401 }
      );
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 401 }
      );
    }

    // Generate new tokens
    const tokens = generateTokens(user);

    return NextResponse.json({
      success: true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return NextResponse.json(
      { success: false, error: 'Invalid refresh token' },
      { status: 403 }
    );
  }
}

export const POST = withCors(withDatabase(refreshHandler));