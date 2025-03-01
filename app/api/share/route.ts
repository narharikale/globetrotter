import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Mock database for shared games
const sharedGames: { id: string; username: string; score: number; }[] = [];

export async function POST(request: Request) {
  try {
    const { username, score } = await request.json();
    
    if (!username || typeof score !== 'number') {
      return NextResponse.json(
        { error: 'Username and score are required' },
        { status: 400 }
      );
    }
    
    // Create a new shared game
    const id = uuidv4();
    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/challenge/${id}`;
    
    sharedGames.push({
      id,
      username,
      score
    });
    
    return NextResponse.json({
      id,
      shareUrl,
      previewImage: `https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?q=80&w=1080&auto=format`
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  
  if (!id) {
    return NextResponse.json(
      { error: 'Game ID is required' },
      { status: 400 }
    );
  }
  
  const game = sharedGames.find(g => g.id === id);
  
  if (!game) {
    return NextResponse.json(
      { error: 'Game not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(game);
}