import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/aiChat.css";

function AIChat() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [lawyerTypes, setLawyerTypes] = useState<{ id: number, type: string }[]>([]);
  const [matchedSpecialty, setMatchedSpecialty] = useState<{ id: number, type: string } | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const navigate = useNavigate();

  const queryAI = async () => {
    if (!input || input.trim().length < 5) {
      setFeedbackMessage("Kérlek, írj be egy hosszabb leírást a jogesetről.");
      setIsSuccess(false);
      setTimeout(() => setFeedbackMessage(""), 4000);
      return;
    }

    setLoading(true);
    setFeedbackMessage("");
    setIsSuccess(null);

    try {
      const res = await fetch("http://localhost:3001/aiChat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();

      if (data?.recommendation) {
        setResponse(data.recommendation);
        await matchSpecialty(data.recommendation);
      } else {
        setResponse("Nem sikerült szakterületet meghatározni.");
        setFeedbackMessage("Nem kaptunk választ az AI-tól.");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("[ERROR]:", error);
      setResponse("Hiba történt.");
      setFeedbackMessage("Hiba történt az AI kérés során.");
      setIsSuccess(false);
    }

    setTimeout(() => setFeedbackMessage(""), 4000);
    setLoading(false);
  };

  const matchSpecialty = async (aiResult: string) => {
    const res = await fetch("http://localhost:3001/auth/lawyertypes");
    const allTypes = await res.json();
    setLawyerTypes(allTypes);

    const normalizedAI = aiResult.trim().toLowerCase();
    const match = allTypes.find((type: { id: number; type: string }) =>
      type.type.trim().toLowerCase() === normalizedAI
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

      {feedbackMessage && (
        <p className={`login-feedback ${isSuccess ? 'success' : 'error'}`}>
          {feedbackMessage}
        </p>
      )}

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
