import { NextResponse } from 'next/server';
import { searchTavily } from '../../src/lib/tavily';

export async function POST(req: Request) {
  const { query } = await req.json();
  const result = await searchTavily(query);
  return NextResponse.json({ result });
}
