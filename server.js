import express from "express";
import cors from "cors";
import fs from "fs";
import { runOrchestrator } from "./orchestrator.js";
import path from "path";

const app = express();
app.use(express.json());
app.use(cors());

const USER_DIR = "./users";

if (!fs.existsSync(USER_DIR)) {
  fs.mkdirSync(USER_DIR);
}

// ---------------------------
// ⭐ HELPERS
// ---------------------------
function clean(text) {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

// ⭐ SELF HEALING JSON EXTRACTOR
function extractJSON(text) {
  if (!text) return null;

  text = clean(text);

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1) return null;

  const jsonStr = text.substring(start, end + 1);

  try {
    return JSON.parse(jsonStr);
  } catch (err) {
    console.log("⚠️ JSON parse failed");
    return null;
  }
}

// ⭐ USER FILE SYSTEM
function getUserFile(name) {
  return path.join(USER_DIR, `${name.toLowerCase()}.json`);
}

function loadUser(name) {
  const file = getUserFile(name);

  if (!fs.existsSync(file)) {
    return { profile: null, history: [] };
  }

  return JSON.parse(fs.readFileSync(file));
}

function saveUser(name, data) {
  fs.writeFileSync(getUserFile(name), JSON.stringify(data, null, 2));
}

// ⭐ AI RESPONSE FIREWALL
function firewallAI(aiData, rawText) {
  if (!aiData) {
    return {
      careers: [],
      steps: clean(rawText),
    };
  }

  // careers validation
  if (!Array.isArray(aiData.careers)) {
    aiData.careers = [];
  }

  // steps validation
  if (!aiData.steps || aiData.steps.length < 20) {
    aiData.steps =
      "Start by improving your core skills, build real projects, and focus on long term growth strategy.";
  }

  return aiData;
}

// ---------------------------
// 🚀 CAREER API
// ---------------------------
app.post("/career", async (req, res) => {
  try {
    const user = req.body;
    const username = user.name.toLowerCase();

    let userData = loadUser(username);

    // save profile first time
    if (!userData.profile) {
      userData.profile = user;
    }

    // ⭐ AI CALL
    const aiRaw = await runOrchestrator({
      ...user,
      history: userData.history,
    });

    console.log("🤖 RAW AI:", aiRaw);

    // ⭐ PARSE JSON
    let aiData = extractJSON(aiRaw);

    // ⭐ FIREWALL PROTECTION
    aiData = firewallAI(aiData, aiRaw);

    // ⭐ SAVE HISTORY
    userData.history.push({ role: "user",time:new Date(), text: JSON.stringify(user) });
    userData.history.push({ role: "ai",time:new Date(),text: aiData.steps });

    saveUser(username, userData);

    // ⭐ RESPONSE
    res.json({
      careers: aiData.careers,
      steps: aiData.steps,
    });
  } catch (err) {
    console.log("🔥 Career API Error:", err);

    res.status(500).json({
      careers: [],
      steps: "AI processing error",
    });
  }
});

// ---------------------------
// 💬 CHAT API (SMART CONTEXT)
// ---------------------------
app.post("/chat", async (req, res) => {
  try {
    const { name, message, type } = req.body;

    let userData = loadUser(name.toLowerCase());

    // ⭐ SMART CONTEXT BRAIN
    let promptType = "general";

    if (type === "skill") promptType = "skill";
    if (type === "career") promptType = "career";
    if (type === "mindset") promptType = "mindset";

    const aiReply = await runOrchestrator({
      profile: userData.profile,
      history: userData.history,
      message,
      mode: promptType,
    });

    // SAVE HISTORY
    userData.history.push({ role: "user",time:new Date(), text: message });
    userData.history.push({ role: "ai",time:new Date(), text: aiReply });

    saveUser(name.toLowerCase(), userData);

    res.json({ reply: clean(aiReply) });
  } catch (err) {
    console.log("🔥 Chat API Error:", err);

    res.json({
      reply: "AI error occurred. Try again.",
    });
  }
});

// ---------------------------
app.listen(5000, () => {
  console.log("🚀 Orchestrator running http://localhost:5000");
});
