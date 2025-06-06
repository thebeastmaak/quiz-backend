import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { OpenAI } from "openai";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/generate-question", async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a quiz master. Return ONE JSON object string only with keys 'question' and 'answer', about FISU World University Games (Olympics-style sports event for university students).",
        },
        {
          role: "user",
          content: "Generate a FISU-related multiple-choice style trivia question.",
        },
      ],
    });

    res.json({ text: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate question" });
  }
});

app.get("/", (req, res) => {
  res.send("Quiz Backend is running.");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
