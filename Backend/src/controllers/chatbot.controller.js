import { GoogleGenerativeAI } from "@google/generative-ai";
import prompt from "../Prompt/chatBotPrompt.js";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not defined in .env file");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export const chatbot = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Invalid message format" });
    }

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: `${prompt}\n\nUser: ${message}` }],
        },
      ],
    });

    const reply = result.response.text().trim();

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Gemini Error:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};
