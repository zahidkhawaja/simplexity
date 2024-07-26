import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { text, complexity } = req.body;

  if (!text || complexity === undefined) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }

  try {
    let prompt;
    if (complexity > 0) {
      prompt = `Given the following English text, rewrite it to be longer and more verbose, while maintaining the exact meaning. Do not add new facts or info. Return only the rewritten text and nothing else:\n\n${text}`;
    } else if (complexity < 0) {
      prompt = `Given the following English text, rewrite it to be shorter and less verbose, while maintaining the exact meaning. Do not add new facts or info. Return only the rewritten text and nothing else:\n\n${text}`;
    } else {
      return res.status(200).json({ result: text });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant",
    });

    const result = chatCompletion.choices[0]?.message?.content || "";

    res.status(200).json({ result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
}