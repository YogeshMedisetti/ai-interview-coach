import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    const prompt = `You are a MERN interviewer. Give simple, fresher-level correct answer in 4-5 lines, with 1 small example if needed. Use simple English. Question: ${question}`;

    const models = ["gemini-3.8-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
    let answer = "";
    for (const m of models) {
      try {
        const model = genAI.getGenerativeModel({ model: m });
        const result = await model.generateContent(prompt);
        answer = result.response.text();
        break;
      } catch (e) {
        console.log("FAILED:", m);
      }
    }
    if (!answer) throw new Error("AI busy");
    return NextResponse.json({ answer });
  } catch {
    return NextResponse.json({ error: "Try again" }, { status: 500 });
  }
}
