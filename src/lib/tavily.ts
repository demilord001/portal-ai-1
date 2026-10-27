export async function searchTavily(query: string) {
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.TAVILY_API_KEY!,
    },
    body: JSON.stringify({
      query,
      max_results: 5,
      include_answer: true,
      include_raw_content: false,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Tavily API error: ${response.status} ${err}`);
  }

  const data = await response.json();
  return data.results?.map((r: any) => r.content).join('\n\n') ?? '';
}
