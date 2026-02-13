import { callAI } from "./ai.js";

export async function runOrchestrator(user){

// ----------------------
// AI #1 — Career Strategist
// ----------------------
const strategistPrompt = `
You are a senior career strategist.

Analyse deeply:

User Profile:
${JSON.stringify(user)}

Previous Chat History:
${JSON.stringify(user.history || [])}

Use past conversation context to give deeper guidance.

Give top 3 career suggestions with deep reasoning.
Return ONLY JSON:
{
 "careers":[
  {"name":"career1","reason":"..."},
  {"name":"career2","reason":"..."},
  {"name":"career3","reason":"..."}
 ]
}
`;

const strategistText = await callAI(strategistPrompt);
const strategist = JSON.parse(
  strategistText.replace(/```json/g,"").replace(/```/g,"")
);

// ----------------------
// AI #2 — Skill Analyzer
// ----------------------
const skillPrompt = `
User profile:
${JSON.stringify(user)}

Analyse strengths, missing skills and growth areas.
Write concise structured paragraph.
`;

const skillAnalysis = await callAI(skillPrompt);

// ----------------------
// AI #3 — Risk Checker
// ----------------------
const riskPrompt = `
Analyse lifestyle risks and bad habits honestly:
${JSON.stringify(user)}
Give motivational but realistic advice.
`;

const riskAdvice = await callAI(riskPrompt);

// ----------------------
// AI #4 — Response Formatter
// ----------------------
const formatterPrompt = `
Combine everything into a clean UI friendly response.

Careers:
${JSON.stringify(strategist.careers)}

Skill Analysis:
${skillAnalysis}

Risk Advice:
${riskAdvice}

Return JSON:

{
 "careers":[...same careers...],
 "steps":"long structured roadmap text"
}
`;

const finalText = await callAI(formatterPrompt);

return finalText;
}
