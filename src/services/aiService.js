export async function getAIInsight(data) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer YOUR_API_KEY`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a productivity coach. Analyze user behavior and give short actionable advice.",
          },
          {
            role: "user",
            content: JSON.stringify(data),
          },
        ],
      }),
    });

    const result = await response.json();

    return result.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.error("AI Error:", err);
    return null;
  }
}