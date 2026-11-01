import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { role } = await req.json();
    const prompt = `You are an interviewer for ${role || "MERN"} fresher. Ask 1 medium level interview question. Only give the question.`;

    const models = ["gemini-3.8-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
    let question = "";
    let lastError = "";

    for (const m of models) {
      try {
        const model = genAI.getGenerativeModel({ model: m });
        const result = await model.generateContent(prompt);
        question = result.response.text();
        break;
      } catch (e: any) {
        lastError = e.message;
        console.log("FAILED:", m);
      }
    }

    if (!question) throw new Error(lastError);
    return NextResponse.json({ question });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    console.log("GEMINI ERROR:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
