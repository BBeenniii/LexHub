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
    if (!input || input.trim().length < 5) {
      alert("Kérlek, írj be egy hosszabb leírást a jogesetről.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/aiChat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();
      console.log("[LOG]: Backend válasz:", data);

      if (data?.recommendation) {
        console.log("[LOG]: AI ajánlás:", data.recommendation);
        setResponse(data.recommendation);
        await matchSpecialty(data.recommendation);
      } else {
        console.warn("[WARNING]: Nincs recommendation kulcs!");
        setResponse("Nem sikerült szakterületet meghatározni.");
      }
    } catch (error) {
      console.error("[ERROR]:", error);
      setResponse("Hiba történt.");
    }
    setLoading(false);
  };

  const matchSpecialty = async (aiResult: string) => {
    console.log("[LOG]: Specialty egyeztetés indul AI válasz alapján:", aiResult);

    const res = await fetch("http://localhost:3001/auth/lawyertypes");
    const allTypes = await res.json();
    setLawyerTypes(allTypes);
    console.log("[LOG]: Elérhető szakterületek:", allTypes);

    const normalizedAI = aiResult.trim().toLowerCase();
    const match = allTypes.find((type: { id: number; type: string }) =>
      type.type.trim().toLowerCase() === normalizedAI
    );

    allTypes.forEach((type: { id: number; type: string }) => {
      console.log(`[LOG]: Összehasonlítás: "${type.type.trim().toLowerCase()}" === "${normalizedAI}" → ${type.type.trim().toLowerCase() === normalizedAI}`);
    });

    if (match) {
      console.log("[LOG]: Talált szakterület:", match);
    } else {
      console.warn("[WARNING]: Nem talált egyező szakterület az AI válasz alapján.");
    }

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
      <h2>MI Ügyvéd kereső</h2>
      <textarea 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Írja le részletesen jogesetét..."
      />
      <button onClick={queryAI} disabled={loading}>
        {loading ? "Feldolgozás..." : "Beküldés"}
      </button>

      <button onClick={handleManual}>Inkább magam választok szakterületet</button>

      {response && (
        <div className="ai-result-box">
          {matchedSpecialty ? (
            <>
              <p>A jogeset elemzése alapján a következő szakterületű jogi képviselőre van szüksége:</p>
              <h4>{matchedSpecialty.type}</h4>
              <button onClick={handleAccept}>Ügyvéd keresése ezzel a szakterülettel</button>
            </>
          ) : (
            <p>Nem sikerült a szakterületet beazonosítani. Válasszon manuálisan!</p>
          )}
        </div>
      )}
    </div>
  );
}

export default AIChat;