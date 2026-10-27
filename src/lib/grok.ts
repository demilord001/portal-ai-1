export async function queryGrok(messages: { role: string; content: string }[]) {
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'grok-beta',
      messages,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Grok API error: ${response.status} ${err}`);
  }

  const data = await response.json();
  // Assume standard OpenAI‑compatible shape
  return data.choices?.[0]?.message?.content ?? '';
}
