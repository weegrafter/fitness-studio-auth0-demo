import { NextResponse } from 'next/server';
import { getUser } from '@/lib/auth0';
import fs from 'fs/promises';
import path from 'path';

export async function POST() {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Read existing requests
    const dataPath = path.join(process.cwd(), 'data', 'upgrade-requests.json');
    let requests = [];
    
    try {
      const fileContent = await fs.readFile(dataPath, 'utf-8');
      requests = JSON.parse(fileContent);
    } catch (error) {
      // File doesn't exist yet, start with empty array
      requests = [];
    }

    // Check if user already has a pending request
    const existingRequest = requests.find(
      (req: any) => req.userId === user.sub && req.status === 'pending'
    );

    if (existingRequest) {
      return NextResponse.json(
        { error: 'You already have a pending upgrade request' },
        { status: 400 }
      );
    }

    // Create new request
    const newRequest = {
      userId: user.sub,
      email: user.email,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };

    requests.push(newRequest);

    // Write updated requests back to file
    await fs.writeFile(dataPath, JSON.stringify(requests, null, 2));

    return NextResponse.json({ success: true, request: newRequest });
  } catch (error) {
    console.error('Error creating upgrade request:', error);
    return NextResponse.json(
      { error: 'Failed to create upgrade request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Read upgrade requests
    const dataPath = path.join(process.cwd(), 'data', 'upgrade-requests.json');
    
    try {
      const fileContent = await fs.readFile(dataPath, 'utf-8');
      const requests = JSON.parse(fileContent);
      return NextResponse.json({ requests });
    } catch (error) {
      // File doesn't exist yet
      return NextResponse.json({ requests: [] });
    }
  } catch (error) {
    console.error('Error reading upgrade requests:', error);
    return NextResponse.json(
      { error: 'Failed to read upgrade requests' },
      { status: 500 }
    );
  }
}
