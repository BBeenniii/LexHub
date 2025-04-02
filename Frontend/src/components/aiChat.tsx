import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/aiChat.css";

function AIChat() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [lawyerTypes, setLawyerTypes] = useState<{ id: number, type: string }[]>([]);
  const [matchedSpecialty, setMatchedSpecialty] = useState<{ id: number, type: string } | null>(null);

  const navigate = useNavigate();

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
      await matchSpecialty(data.result);
    } catch (error) {
      console.error("[ERROR]:", error);
      setResponse("Hiba történt.");
    }
    setLoading(false);
  };

  const matchSpecialty = async (aiResult: string) => {
    const res = await fetch("http://localhost:3001/auth/lawyertypes");
    const allTypes = await res.json();
    setLawyerTypes(allTypes);

    const match = allTypes.find((type: { id: number, type: string }) =>
      aiResult.toLowerCase().includes(type.type.toLowerCase())
    );

    setMatchedSpecialty(match || null);
  };

  const handleAccept = () => {
    if (matchedSpecialty) {
      navigate(`/lexSearch?specialtyId=${matchedSpecialty.id}&mode=nearby`);
    }
  };

  const handleManual = () => {
    navigate(`/lexSearch?mode=manual`);
  };

  return (
    <div className="chat-container">
      <h2>Lexhub AI Chat</h2>
      <textarea 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        placeholder="Írja lé részletesen jogesetét..."
      />
      <button onClick={queryAI} disabled={loading}>
        {loading ? "Feldolgozás..." : "Beküldés"}
      </button>

      <button onClick={handleManual}>Inkább saját szakterületet választok</button>

      {response && (
  <div className="ai-result-box">
    {matchedSpecialty ? (
      <>
        <p>A jogeset elemzése alapján a következő szakterületű jogi képviselőre van szüksége:</p>
        <h4>{matchedSpecialty.type}</h4>
        <button onClick={handleAccept}>Ügyvéd keresése ezzel a szakterülettel</button>
      </>
    ) : (
      <p>Nem sikerült szakterületet azonosítani. Válassz kézzel.</p>
    )}
  </div>
)}
    </div>
  );
}

export default AIChat;