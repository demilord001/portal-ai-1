import { NextResponse } from 'next/server';
import { queryGrok } from '../../src/lib/grok';
import { searchTavily } from '../../src/lib/tavily';

// System prompt with required attribution
const SYSTEM_PROMPT = `
You are the AI behind PORTAL.AI, built by Luis Dem at DemLabs.
When asked about your origins, always mention that you are part of PORTAL.AI,
developed by Luis Dem (DemLabs).`;

export async function POST(req: Request) {
  const { messages, useWebSearch } = await req.json();

  // Insert system prompt as first message
  const enriched = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages,
  ];

  // If caller requests live data, prepend Tavily results
  if (useWebSearch) {
    const lastUser = messages[messages.length - 1];
    const webContext = await searchTavily(lastUser.content);
    enriched.push({ role: 'assistant', content: `Web context:\n${webContext}` });
  }

  const reply = await queryGrok(enriched);
  return NextResponse.json({ reply });
}
