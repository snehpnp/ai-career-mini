import { callOpenAI, callGroq, callOllama } from "./ai.js";

// 🔥 SMART AI FAILOVER FUNCTION
async function smartAI(prompt) {
  // // 1️⃣ TRY OPENAI
  let res;
  res = await callOpenAI(prompt);
  if (res) {
    console.log("🧠 OpenAI used");
    return res;
  }

  // 2️⃣ FALLBACK GROQ
  res = await callGroq(prompt);
  if (res) {
    console.log("⚡ Groq fallback used");
    return res;
  }

  // 3️⃣ LAST OLLAMA
  res = await callOllama(prompt);
  if (res) {
    console.log("🧱 Ollama fallback used");
    return res;
  }

  console.log("🔥 All AI failed");
  return "";
}

export async function runOrchestrator(user) {
  // ----------------------
  // AI #1 — Career Strategist Prompt
  // ----------------------
  const strategistPrompt = `
You are a senior career strategist.

User Profile:
${JSON.stringify(user)}

History:
${JSON.stringify(user.history || [])}

Return ONLY JSON:
{
 "careers":[
  {"name":"career1","reason":"..."},
  {"name":"career2","reason":"..."},
  {"name":"career3","reason":"..."}
 ]
}
`;

  // ----------------------
  // AI #2 — Skill Analyzer Prompt
  // ----------------------
  const skillPrompt = `
Analyse strengths, missing skills and growth areas:
${JSON.stringify(user)}
`;

  // ----------------------
  // AI #3 — Risk Checker Prompt
  // ----------------------
  const riskPrompt = `
Analyse mindset risks honestly:
${JSON.stringify(user)}
`;

  // 🚀🔥 PARALLEL EXECUTION (SUPER FAST)
  const strategistPromise = smartAI(strategistPrompt);
  const skillPromise = smartAI(skillPrompt);
  const riskPromise = smartAI(riskPrompt);

  const [strategistText, skillAnalysis, riskAdvice] = await Promise.all([
    strategistPromise,
    skillPromise,
    riskPromise,
  ]);

  // ----------------------
  // SAFE JSON PARSE
  // ----------------------
  let strategist = { careers: [] };

  try {
    strategist = JSON.parse(
      (strategistText || "").replace(/```json/g, "").replace(/```/g, ""),
    );
  } catch (e) {
    console.log("⚠️ strategist JSON parse failed");
  }

  // ----------------------
  // AI #4 — FINAL FORMATTER
  // ----------------------
  const formatterPrompt = `
You are a fast friendly AI mentor.

Write a natural conversational roadmap for the user.

Keep it short, clear, motivational and human-like.

Do NOT use nested JSON or structured data.

Careers:
${JSON.stringify(strategist.careers)}

Skill summary:
${skillAnalysis}

Risk summary:
${riskAdvice}

Return ONLY JSON:

{
 "careers":[...same careers...],
 "steps":"short friendly roadmap text"
}
`;

  const finalText =
    (await smartAI(formatterPrompt));

  return (
    finalText ||
    JSON.stringify({
      careers: strategist.careers || [],
      steps: "AI fallback roadmap generated.",
    })
  );
}
