import fetch from "node-fetch";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

// ----------------------------
// 🔥 GROQ CLIENT
// ----------------------------
const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ----------------------------
// 🧠 OPENAI CALL (PRIMARY)
// ----------------------------
export async function callOpenAI(prompt){
  try{

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

    if(!data?.choices){
      console.log("❌ OpenAI Error:", data?.error?.message);
      return null;
    }

    console.log("🧠 OpenAI response used");
    return data.choices[0].message.content;

  }catch(err){
    console.log("❌ OpenAI crashed");
    return null;
  }
}

// ----------------------------
// ⚡ GROQ CALL (FAST FALLBACK)
// ----------------------------
export async function callGroq(prompt){
  try{

    const chat = await groqClient.chat.completions.create({
      model:"llama-3.3-70b-versatile",
      messages:[{role:"user",content:prompt}],
      temperature:0.7
    });

    console.log("⚡ Groq response used");
    return chat.choices[0].message.content;

  }catch(err){
    console.log("❌ Groq crashed");
    return null;
  }
}

// ----------------------------
// 🧱 OLLAMA CALL (LOCAL LAST)
// ----------------------------
export async function callOllama(prompt){
  try{

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

    console.log("🧱 Ollama response used");

    return data?.message?.content || null;

  }catch(err){
    console.log("⚠️ Ollama offline");
    return null;
  }
}

// ----------------------------
// 🔥 MAIN FAILOVER BRAIN
// ----------------------------
export async function callAIWithFailover(prompt){

  // 1️⃣ TRY OPENAI
  const openai = await callOpenAI(prompt);
  if(openai) return openai;

  // 2️⃣ FALLBACK GROQ
  const groq = await callGroq(prompt);
  if(groq) return groq;

  // 3️⃣ LAST FALLBACK OLLAMA
  const ollama = await callOllama(prompt);
  if(ollama) return ollama;

  // ❌ ALL FAILED
  console.log("🔥 All AI providers failed");

  return "AI system temporarily unavailable. Please try again.";
}
