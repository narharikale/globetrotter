import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Mock database for users
let users: { id: string; username: string; score: number; completedCities: string[] }[] = [];

export async function POST(request: Request) {
  try {
    const { username } = await request.json();
    
    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }
    
    // Create a new user
    const newUser = {
      id: uuidv4(),
      username,
      score: 0,
      completedCities: []
    };
    
    users.push(newUser);
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(users);
}