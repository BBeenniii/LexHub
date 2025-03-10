import { useState } from "react";

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
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>ChatGPT AI Chat</h2>
      <input 
        type="text" 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        placeholder="Írj be valamit..."
      />
      <button onClick={queryAI} disabled={loading}>
        {loading ? "Betöltés..." : "Küldés"}
      </button>
      <p><strong>Válasz:</strong> {response}</p>
    </div>
  );
}

export default AIChat;
