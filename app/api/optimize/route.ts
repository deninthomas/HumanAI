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

    let systemPrompt = "";
    if (mode === 'humanize') {
      systemPrompt = `You are a professional blog writer. Rewrite the provided text to sound completely natural and human-like. 
Tone: ${tone}. 
Avoid AI cliches, robotic phrasing, and repetitive sentence structures.
Make it engaging and conversational.

Additional Requirements:
- Avoid textbook tone.
- Write like a real blogger.
- Use personal sounding phrasing.
- Vary sentence length aggressively.`;
    } else if (mode === 'faq') {
      systemPrompt = `You are an SEO expert. Generate 5 relevant Frequently Asked Questions (FAQs) and their answers based on the provided text.
Tone: ${tone}.
Avoid textbook tone.
Write like a real blogger.
Use personal sounding phrasing.
Vary sentence length aggressively.
Format: Markdown.`;
    } else if (mode === 'meta') {
      systemPrompt = `You are an SEO expert. Generate an optimized Meta Title (max 60 chars) and Meta Description (max 160 chars) for the provided text.
Tone: ${tone}.
Avoid textbook tone.
Write like a real blogger.
Use personal sounding phrasing.
Vary sentence length aggressively.
Format:
**Title**: [Title]
**Description**: [Description]`;
    } else {
      // SEO Mode
      systemPrompt = `You are a professional SEO blog writer.
Rewrite and optimize the blog post provided.

Requirements:
- Sound completely human and natural.
- Tone: ${tone}.
- Avoid textbook tone.
- Write like a real blogger.
- Use personal sounding phrasing.
- Vary sentence length aggressively.
- Improve clarity and flow.
- Add proper markdown headings (H1, H2, H3) where appropriate.
- Include the keyword "${keyword || 'relevant keywords'}" naturally.
- Avoid obvious AI patterns (e.g. "In conclusion", "delve into").
- Maintain the original meaning but enhance readability.
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
        temperature: 0.7,
        top_p: 0.9
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
