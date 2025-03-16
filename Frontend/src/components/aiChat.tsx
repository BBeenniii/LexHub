import { useState } from "react";
import "..style/aiChat.css";

function AIChat() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const queryAI = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/aiChat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input })
      });

      const data = await res.json();
      setResponse(data.result);
    } catch (error) {
      console.error("Hiba:", error);
      setResponse("Hiba történt.");
    }
    setLoading(false);
  };

  return (
    <div className="chat-container">
      <h2>Lexhub AI Chat</h2>
      <textarea 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        placeholder="Add meg az ügyed adatait..."
      />
      <button onClick={queryAI} disabled={loading}>
        {loading ? "Loading..." : "Submit "}
      </button>
      <p><strong>Answer:</strong> {response}</p>
    </div>
  );
}

export default AIChat;