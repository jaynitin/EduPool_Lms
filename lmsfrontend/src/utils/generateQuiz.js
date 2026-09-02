// src/utils/generateQuiz.js
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = "gemini-3.5-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

export async function generateQuiz({
  topic,
  numQuestions = 5,
  difficulty = "Medium",
}) {
  const prompt = `Generate a multiple-choice quiz on the topic "${topic}".
Difficulty: ${difficulty}.
Number of questions: ${numQuestions}.

Return ONLY valid JSON, no markdown formatting, no code fences, matching exactly this shape:
{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctIndex": 0,
      "explanation": "string, short explanation of the correct answer"
    }
  ]
}`;

  const res = await fetch(`${ENDPOINT}?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    }),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw new Error(errBody?.error?.message || "Failed to generate quiz");
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("No response from Gemini");

  const parsed = JSON.parse(text);
  if (!parsed.questions || !Array.isArray(parsed.questions)) {
    throw new Error("Unexpected response format");
  }
  return parsed.questions;
}
