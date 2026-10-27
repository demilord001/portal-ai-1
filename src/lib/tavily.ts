export async function searchTavily(query: string): Promise<string> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error('TAVILY_API_KEY not set');
  }
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({ query, max_results: 5, include_images: false }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(Tavily API error : );
  }
  const data = await response.json();
  const results = data.results?.map((r: any) => r.content).join('\n---\n') ?? '';
  return results;
}
