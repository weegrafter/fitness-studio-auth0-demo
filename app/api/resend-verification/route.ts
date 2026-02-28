import { NextResponse } from 'next/server';
import { getUser } from '@/lib/auth0';

export async function POST() {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (user.email_verified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      );
    }

    // Get Auth0 Management API token
    const tokenResponse = await fetch(
      `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'client_credentials',
          client_id: process.env.AUTH0_CLIENT_ID,
          client_secret: process.env.AUTH0_CLIENT_SECRET,
          audience: `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/`,
        }),
      }
    );

    if (!tokenResponse.ok) {
      throw new Error('Failed to get management API token');
    }

    const { access_token } = await tokenResponse.json();

    // Send verification email via Management API
    const verificationResponse = await fetch(
      `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/jobs/verification-email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          user_id: user.sub,
          client_id: process.env.AUTH0_CLIENT_ID,
        }),
      }
    );

    if (!verificationResponse.ok) {
      const errorData = await verificationResponse.json();
      throw new Error(errorData.message || 'Failed to send verification email');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending verification email:', error);
    return NextResponse.json(
      { error: 'Failed to send verification email' },
      { status: 500 }
    );
  }
}
