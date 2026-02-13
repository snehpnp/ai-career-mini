// import fetch from "node-fetch";
// import dotenv from "dotenv";
// dotenv.config();

// export async function generateAIResult(user) {
//   try {
//     const prompt = `
// You are NOT a simple AI assistant.

// You are a brutally honest SENIOR CAREER STRATEGIST
// who gives deep long-term planning like a real mentor.

// Analyse this person deeply:

// Name: ${user.name}
// Age: ${user.age}
// Education: ${user.education}
// Interests: ${user.interest}
// Hobby: ${user.hobby}
// Goal: ${user.goal}

// IMPORTANT RULES:

// - Think step by step.
// - Analyse strengths, weaknesses and hidden potential.
// - Give STRONG honest advice.
// - Combine career strategy + lifestyle advice.
// - Response must feel like a real mentor talking.

// Return ONLY JSON:

// {
//   "careers":[
//     {"name":"career1","reason":"deep reasoning"},
//     {"name":"career2","reason":"deep reasoning"},
//     {"name":"career3","reason":"deep reasoning"}
//   ],
//   "steps":"Write a LONG strategic roadmap divided into phases like Phase 1, Phase 2, Phase 3 with actionable guidance, mindset advice, skill building and future positioning."
// }
// `;

//     const response = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "gpt-4.1",
//         messages: [{ role: "user", content: prompt }],
//         response_format: {
//           type: "json_schema",
//           json_schema: {
//             name: "career_schema",
//             strict: true,
//             schema: {
//               type: "object",
//               properties: {
//                 careers: {
//                   type: "array",
//                   items: {
//                     type: "object",
//                     properties: {
//                       name: { type: "string" },
//                       reason: { type: "string" },
//                     },
//                     required: ["name", "reason"],
//                     additionalProperties: false,
//                   },
//                 },
//                 steps: { type: "string" },
//               },
//               required: ["careers", "steps"],
//               additionalProperties: false,
//             },
//           },
//         },
//       }),
//     });

//     const data = await response.json();
//     return data.choices[0].message.content;
//   } catch (error) {
//     console.log("error", error);
//   }
// }


import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

export async function callAI(prompt){
  console.log

  const res = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${process.env.OPENAI_API_KEY}`
      },
      body:JSON.stringify({
        model:"gpt-4.1",
        messages:[{role:"user",content:prompt}],
        temperature:0.7
      })
    }
  );

  const data = await res.json();
  return data.choices[0].message.content;
}
