import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { question, answer } = await req.json();
    const prompt = `You are a strict but friendly MERN interviewer.
Question: ${question}
Student Answer: ${answer}
Give result in this exact format:
Score: X/10
Good: 1 line what was good
Missing: 1 line what is missing
Correct Answer: 3-4 lines simple correct answer`;

    const models = ["gemini-3.8-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
    let feedback = "";
    for (const m of models) {
      try {
        const model = genAI.getGenerativeModel({ model: m });
        const result = await model.generateContent(prompt);
        feedback = result.response.text();
        break;
      } catch (e) {
        console.log("FAILED:", m);
      }
    }
    if (!feedback) throw new Error("AI busy");
    return NextResponse.json({ feedback });
  } catch {
    return NextResponse.json({ error: "Try again" }, { status: 500 });
  }
}
