export async function queryGrok(messages: {role: string; content: string}[]): Promise<string> {
  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) {
    throw new Error('GROK_API_KEY not set');
  }
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: Bearer ,
    },
    body: JSON.stringify({ model: 'grok-beta', messages }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(Grok API error : );
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? '';
}
