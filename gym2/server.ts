import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI Client (Server-Side Only)
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  // API Endpoint: AI Fitness Assistant Chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history, memberContext } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required." });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          text: "Gemini API key is not configured in process.env.GEMINI_API_KEY. Please add your GEMINI_API_KEY in the Secrets panel to enable real-time AI fitness coaching.",
        });
      }

      const systemInstruction = `You are FitFlow AI Coach, an expert certified personal trainer, fitness nutritionist, and exercise biomechanics consultant at FitFlow Gym.
Your goal is to help gym members with clear, safe, engaging, and scientifically sound advice on workouts, exercises, muscle building, form corrections, fat loss, protein/nutrition guidelines, and recovery.

Member Details Context (if provided):
- Name: ${memberContext?.fullName || "Member"}
- Fitness Goal: ${memberContext?.fitnessGoal || "General Health & Strength"}
- Current Duration: ${memberContext?.currentDuration || "Active Plan"}

Instructions for response:
1. Provide actionable, well-structured, friendly advice.
2. Use bullet points and bold text for exercise steps, sets/reps, and tips.
3. If the user asks about specific body parts (Biceps, Triceps, Chest, Back, Shoulders, Legs, Abs), give targeted exercise recommendations with proper warm-up and form safety notes.
4. Keep tone encouraging, professional, and energetic!`;

      // Construct messages context for Gemini
      let fullPrompt = `${systemInstruction}\n\n`;
      if (Array.isArray(history) && history.length > 0) {
        fullPrompt += "Previous Chat Context:\n";
        history.slice(-6).forEach((h: { sender: string; text: string }) => {
          fullPrompt += `${h.sender === "user" ? "Member" : "Coach"}: ${h.text}\n`;
        });
      }
      fullPrompt += `\nMember Question: ${message}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: fullPrompt,
      });

      const replyText = response.text || "I'm sorry, I couldn't process that query right now. Please try asking again!";
      return res.json({ text: replyText });
    } catch (err: any) {
      console.error("Error calling Gemini API:", err);
      return res.status(500).json({
        error: "Failed to communicate with AI Assistant.",
        details: err?.message || String(err),
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
