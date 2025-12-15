import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const apiKey = process.env.TMDB_API_KEY;
    const baseUrl = process.env.TMDB_BASE_URL;

    if (!apiKey || !baseUrl) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${baseUrl}/movie/${id}?api_key=${apiKey}&language=en-US`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch movie details from TMDB');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Movie details API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movie details' },
      { status: 500 }
    );
  }
}
