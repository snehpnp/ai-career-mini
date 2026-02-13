import fetch from "node-fetch";
import dotenv from "dotenv";
import Groq from "groq-sdk";


dotenv.config();

// ✅ Groq Client
const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ---------------- OPENAI
export async function callOpenAI(prompt){

  const res = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${process.env.OPENAI_API_KEY}`
      },
      body:JSON.stringify({
        model:"gpt-4o-mini",
        messages:[{role:"user",content:prompt}],
        temperature:0.7
      })
    }
  );

  const data = await res.json();
  return data.choices[0].message.content;
}

// ---------------- GROQ
export async function callGroq(prompt){

  const chat = await groqClient.chat.completions.create({
    model:"llama-3.3-70b-versatile",
    messages:[{role:"user",content:prompt}],
    temperature:0.7
  });

  return chat.choices[0].message.content;
}

// ---------------- OLLAMA
export async function callOllama(prompt){

  const res = await fetch(
    "http://localhost:11434/api/chat",
    {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({
        model:"llama3",
        messages:[{role:"user",content:prompt}]
      })
    }
  );

  const data = await res.json();
  return data.message.content;
}
