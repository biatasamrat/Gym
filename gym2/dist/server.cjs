var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_genai = require("@google/genai");
var import_vite = require("vite");
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new import_genai.GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history, memberContext } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required." });
      }
      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          text: "Gemini API key is not configured in process.env.GEMINI_API_KEY. Please add your GEMINI_API_KEY in the Secrets panel to enable real-time AI fitness coaching."
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
      let fullPrompt = `${systemInstruction}

`;
      if (Array.isArray(history) && history.length > 0) {
        fullPrompt += "Previous Chat Context:\n";
        history.slice(-6).forEach((h) => {
          fullPrompt += `${h.sender === "user" ? "Member" : "Coach"}: ${h.text}
`;
        });
      }
      fullPrompt += `
Member Question: ${message}`;
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: fullPrompt
      });
      const replyText = response.text || "I'm sorry, I couldn't process that query right now. Please try asking again!";
      return res.json({ text: replyText });
    } catch (err) {
      console.error("Error calling Gemini API:", err);
      return res.status(500).json({
        error: "Failed to communicate with AI Assistant.",
        details: err?.message || String(err)
      });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
