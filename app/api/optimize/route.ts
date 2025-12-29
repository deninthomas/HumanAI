import { NextResponse } from 'next/server';

const MODEL = "Qwen/Qwen2.5-Coder-32B-Instruct";

export async function POST(req: Request) {
  const HF_TOKEN = process.env.HF_TOKEN;
  if (!HF_TOKEN) {
    return NextResponse.json({ error: 'HF_TOKEN not configured in .env.local' }, { status: 500 });
  }

  try {
    const { text, keyword, mode, tone } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const humanizeInstructions = `
CRITICAL: You are a human writer, NOT an AI.
1. UNPREDICTABILITY:
   - Aggressively vary sentence length (mix 3-word sentences with 30-word complex ones).
   - Use irregular paragraph structures.
   - Insert rhetorical questions and conversational interjections ("Right?", "You know...").
   
2. FORBIDDEN WORDS (Do NOT use these):
   - "Crucial", "Paramount", "Undoubtedly", "Metaphorical"
   - "Dive in", "Delve", "Explore", "Uncover", "Navigate"
   - "In conclusion", "Summary", "Wrap up", "Remember"
   - "Tapestry", "Symphony", "Landscape", "Realm"
   - "Game-changer", "Revolutionize", "Foster"
   
3. HUMAN STYLE:
   - Use emotional language and personal opinions.
   - Use contractions (don't, can't, it's).
   - Use idioms and colloquialisms appropriate for the tone.
   - Drop the "perfect" grammar slightly if it sounds too robotic.
   - Tone: ${tone}.
`;

    let systemPrompt = "";
    if (mode === 'humanize') {
      systemPrompt = `You are a professional blog writer. Rewrite the provided text to maximize Perplexity and Burstiness.
${humanizeInstructions}
- Rewrite the text completely to bypass AI detection.
- Make it indistinguishable from a human writing.`;
    } else if (mode === 'faq') {
      systemPrompt = `You are an SEO expert. Generate 5 relevant FAQs.
${humanizeInstructions}
- Answers must be direct and personal.
- No robotic intros/outros.
Format: Markdown.`;
    } else if (mode === 'meta') {
      systemPrompt = `You are an SEO expert. Generate an optimized Meta Title and Description.
${humanizeInstructions}
- Max 60 chars for Title.
- Max 160 chars for Description.
Format:
**Title**: [Title]
**Description**: [Description]`;
    } else {
      // SEO Mode
      systemPrompt = `You are a professional SEO blog writer.
${humanizeInstructions}
- Keyword: "${keyword || 'relevant keywords'}" (include naturally, don't force it).
- Add proper markdown headings (H1, H2, H3).
- Avoid all common AI patterns.
- Output clean Markdown.`;
    }

    // Call HuggingFace Inference API via OpenAI-compatible endpoint
    const response = await fetch(`https://router.huggingface.co/v1/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text }
        ],
        max_tokens: 2048,
        temperature: 0.9, // Increased for more randomness/perplexity
        top_p: 0.95,      // Slightly higher top_p for vocabulary variety
        frequency_penalty: 0.8, // Penalize repetition
        presence_penalty: 0.6   // Encourage new topics
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`HuggingFace API Error: ${response.status} ${errText}`);
    }

    const data = await response.json();
    const generatedText = data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content
      : "Error: Unexpected response format from AI.";

    return NextResponse.json({ result: generatedText.trim() });

  } catch (error: any) {
    console.error("Optimization Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to generate content' }, { status: 500 });
  }
}
