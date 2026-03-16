import express from 'express';
import OpenAI from 'openai';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const client = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: 'https://api.x.ai/v1',
});

const SYSTEM_PROMPT = `You are FullStackBuilder — the world's most powerful full-stack AI developer.
You can build ANY web app from a single sentence description.

Rules:
- Always output COMPLETE, runnable code.
- For frontend: give index.html + styles.css + script.js (use Tailwind via CDN when possible).
- For Node backend: give package.json + server.js + routes + .env example.
- For Python backend: give main.py + requirements.txt + Dockerfile.
- Structure output as markdown with clear file names and code blocks like:
  **filename: server.js**
  \`\`\`js
  code here
  \`\`\`
- Include README with how to run + deploy instructions.
- Use modern best practices (async/await, validation, security).
- If unclear, ask one clarifying question then build anyway.

You are extremely creative and fast.`;

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body; // messages = [{role: "user", content: "..."}]

    const completion = await client.responses.create({
      model: "grok-4.20-beta-latest-non-reasoning", // or "grok-code-fast-1" for pure coding speed
      input: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 8000,
    });

    res.json({ reply: completion.output_text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "API error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 FullStackBuilder running on http://localhost:${PORT}`));
