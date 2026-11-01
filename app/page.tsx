"use client";
import { useState } from "react";

export default function Home() {
  const [role, setRole] = useState("MERN");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [loadingAnswer, setLoadingAnswer] = useState(false);

  const getQuestion = async () => {
    setLoading(true);
    setQuestion("");
    setAnswer("");
    setFeedback("");
    setCorrectAnswer("");
    const res = await fetch("/api/interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const data = await res.json();
    setQuestion(data.question || "Try again");
    setLoading(false);
  };

  const checkAnswer = async () => {
    if (!answer.trim()) return alert("Answer type chey mundu");
    setChecking(true);
    setFeedback("");
    const res = await fetch("/api/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, answer }),
    });
    const data = await res.json();
    setFeedback(data.feedback || "Try again");
    setChecking(false);
  };

  const showAnswer = async () => {
    setLoadingAnswer(true);
    const res = await fetch("/api/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    setCorrectAnswer(data.answer || "Try again");
    setLoadingAnswer(false);
  };

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: "0 auto" }}>
      <h1>AI Interview Coach</h1>
      <p>MERN Fresher Interview</p>
      <input
        value={role}
        onChange={(e) => setRole(e.target.value)}
        style={{ padding: 10, borderRadius: 8, color: "black", width: "100%" }}
      />
      <br />
      <button
        onClick={getQuestion}
        style={{
          marginTop: 10,
          padding: "10px 20px",
          borderRadius: 8,
          background: "#000",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        {loading ? "Loading..." : "Get Question"}
      </button>
      {question && (
        <>
          <div
            style={{
              marginTop: 20,
              padding: 20,
              background: "#f1f1f1",
              color: "black",
              borderRadius: 10,
            }}
          >
            <b>Question:</b> {question}
          </div>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            style={{
              width: "100%",
              height: 120,
              marginTop: 20,
              padding: 15,
              borderRadius: 10,
              color: "black",
              background: "#fff",
            }}
          />
          <div>
            <button
              onClick={checkAnswer}
              style={{
                marginTop: 10,
                padding: "10px 20px",
                borderRadius: 8,
                background: "#22c55e",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              {checking ? "Checking..." : "Check My Answer"}
            </button>
            <button
              onClick={showAnswer}
              style={{
                marginLeft: 10,
                marginTop: 10,
                padding: "10px 20px",
                borderRadius: 8,
                background: "#3b82f6",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              {loadingAnswer ? "Loading..." : "Show Answer"}
            </button>
          </div>
          {feedback && (
            <div
              style={{
                marginTop: 20,
                padding: 20,
                background: "#f1f1f1",
                color: "black",
                borderRadius: 10,
                whiteSpace: "pre-line",
              }}
            >
              {feedback}
            </div>
          )}
          {correctAnswer && (
            <div
              style={{
                marginTop: 20,
                padding: 20,
                background: "#e0f2fe",
                color: "black",
                borderRadius: 10,
                whiteSpace: "pre-line",
              }}
            >
              <b>Correct Answer:</b>
              <br />
              {correctAnswer}
            </div>
          )}
        </>
      )}
    </div>
  );
}
