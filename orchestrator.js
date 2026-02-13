import { callOpenAI, callGroq, callOllama } from "./ai.js";

export async function runOrchestrator(user){

// ----------------------
// AI #1 — Career Strategist (OPENAI)
// ----------------------
const strategistPrompt = `
You are a senior career strategist.

User Profile:
${JSON.stringify(user)}

History:
${JSON.stringify(user.history||[])}

Return ONLY JSON:
{
 "careers":[
  {"name":"career1","reason":"..."},
  {"name":"career2","reason":"..."},
  {"name":"career3","reason":"..."}
 ]
}
`;

const strategistText = await callOpenAI(strategistPrompt);

const strategist = JSON.parse(
  strategistText.replace(/```json/g,"").replace(/```/g,"")
);

// ----------------------
// AI #2 — Skill Analyzer (GROQ FAST)
// ----------------------
const skillPrompt = `
Analyse strengths, missing skills and growth areas:
${JSON.stringify(user)}
`;

const skillAnalysis = await callGroq(skillPrompt);

// ----------------------
// AI #3 — Risk Checker (OLLAMA LOCAL)
// ----------------------
const riskPrompt = `
Analyse mindset risks honestly:
${JSON.stringify(user)}
`;

const riskAdvice = await callOllama(riskPrompt);

// ----------------------
// AI #4 — FINAL FORMATTER (OPENAI)
// ----------------------
const formatterPrompt = `
Combine everything into powerful roadmap.

Careers:
${JSON.stringify(strategist.careers)}

Skill:
${skillAnalysis}

Risk:
${riskAdvice}

Return JSON:

{
 "careers":[...same careers...],
 "steps":"deep long roadmap"
}
`;

const finalText = await callOpenAI(formatterPrompt);

return finalText;
}
