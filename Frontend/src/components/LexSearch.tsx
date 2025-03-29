import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUser } from '../utils/auth-utils';
import { User } from '../types/User';
import axios from 'axios';
import '../style/LexSearch.css';

interface Lawyer {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
}

const LexSearch: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();

  const [lawyerTypes, setLawyerTypes] = useState<{ id: number; type: string }[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<number | null>(null);
  const [locationType, setLocationType] = useState<'nearby' | 'county' | 'city'>('nearby');
  const [county, setCounty] = useState('');
  const [city, setCity] = useState('');
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    axios.get('http://localhost:3001/auth/lawyertypes').then(res => {
      setLawyerTypes(res.data);
    });

    const storedUser = getUser();
    if (storedUser) setUser(storedUser);
  }, []);

  useEffect(() => {
    const sId = queryParams.get('specialtyId');
    const modeParam = queryParams.get('mode');
    if (sId) {
      setSelectedSpecialty(Number(sId));
    }
    if (modeParam === 'nearby') {
      setLocationType('nearby');
    } else if (modeParam === 'manual') {
      setLocationType('county');
    }
  }, [location.search]);

  const handleSearch = async () => {
    if (!selectedSpecialty) {
      alert('Válassz szakterületet!');
      return;
    }

    const query: any = { specialtyId: selectedSpecialty };

    if (locationType === 'nearby') {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            query.lat = latitude;
            query.lng = longitude;
            const res = await axios.get('http://localhost:3001/lawyers/search', { params: query });
            setLawyers(res.data);
          },
          async () => {
            const fallbackCounty = user?.county ?? 'Pest';
            const fallbackCity = user?.city ?? 'Budapest';
            query.county = fallbackCounty;
            query.city = fallbackCity;
            const res = await axios.get('http://localhost:3001/lawyers/search', { params: query });
            setLawyers(res.data);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );
      } else {
        console.warn("[WARNING]: A böngésződ nem támogatja a geolocation API-t");
      }
    } else if (locationType === 'county') {
      if (!county) {
        alert("Adj meg egy megyét!");
        return;
      }
      query.county = county;
      const res = await axios.get('http://localhost:3001/lawyers/search', { params: query });
      setLawyers(res.data);
    } else if (locationType === 'city') {
      if (!city) {
        alert("Adjon meg egy várost!");
        return;
      }
      query.city = city;
      const res = await axios.get('http://localhost:3001/lawyers/search', { params: query });
      setLawyers(res.data);
    }
  };

  const handleStartChat = async (providerId: number, providerName: string) => {
    const user = getUser();
    if (!user) {
      alert("Jelentkezzen be a chat használatához!");
      return;
    }
  
    try {
      const res = await fetch(`http://localhost:3001/messages/conversation/${user.id}/${providerId}`);
      const data = await res.json();
  
      navigate("/chat", {
        state: {
          selectedConversationId: data.conversationId,
          participant: {
            id: providerId,
            name: providerName,
          },
        },
      });
    } catch (err) {
      console.error("[ERROR]: Hiba a beszélgetés indításakor:", err);
    }
  };
  

  return (
    <div className="lex-search-container">
      <h2>Ügyvéd kereső</h2>

      <div className="filters">
        <label>Szakterület:</label>
        <select
          value={selectedSpecialty ?? ''}
          onChange={(e) => setSelectedSpecialty(Number(e.target.value))}
        >
          <option value="">-- Válassz szakterületet --</option>
          {lawyerTypes.map(type => (
            <option key={type.id} value={type.id}>{type.type}</option>
          ))}
        </select>

        <label>Helyszín szerinti szűrés:</label>
        <select value={locationType} onChange={(e) => setLocationType(e.target.value as any)}>
          <option value="nearby">Közelemben</option>
          <option value="county">Megye szerint</option>
          <option value="city">Város szerint</option>
        </select>

        {locationType === 'county' && (
          <>
            <label>Megye:</label>
            <input type="text" value={county} onChange={(e) => setCounty(e.target.value)} />
          </>
        )}

        {locationType === 'city' && (
          <>
            <label>Város:</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
          </>
        )}

        <button onClick={handleSearch}>Keresés</button>
      </div>

      <div className="results">
        {lawyers.length === 0 && <p>Nincs megjeleníthető ügyvéd.</p>}
        {lawyers.map(lawyer => (
          <div key={lawyer.id} className="lawyer-card">
            <h4>{lawyer.name}</h4>
            <p>{lawyer.email}</p>
            <p>{lawyer.phone}</p>
            <p>{lawyer.city}, {lawyer.country}</p>
            <button onClick={() => handleStartChat(lawyer.id, lawyer.name)}>Beszélgetés kezdeményezése</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LexSearch;