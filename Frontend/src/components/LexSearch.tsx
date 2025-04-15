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
  const [searched, setSearched] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isError, setIsError] = useState<boolean | null>(null);

  useEffect(() => {
    axios.get('http://localhost:3001/auth/lawyertypes').then(res => {
      setLawyerTypes(res.data);
    });

    const storedUser = getUser() as User;
    if (storedUser) {
      setUser({
        ...storedUser,
        phone: storedUser.phone || '',
        country: storedUser.country || '',
        county: storedUser.county || '',
        city: storedUser.city || ''
      });
    }
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
      setFeedbackMessage('Válassz szakterületet!');
      setIsError(true);
      hideFeedbackLater();
      return;
    }

    setSearched(true);
    setFeedbackMessage('');
    setIsError(null);

    const query: any = { specialtyId: selectedSpecialty };

    try {
      if (locationType === 'nearby') {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              const { latitude, longitude } = pos.coords;
              query.lat = latitude;
              query.lng = longitude;

              const res = await axios.get('http://localhost:3001/lawyers/search', { params: query });
              setLawyers(res.data);
              if (res.data.length === 0) {
                setFeedbackMessage('Nincs megjeleníthető ügyvéd.');
                setIsError(false);
                hideFeedbackLater();
              }
            },
            async () => {
              const fallbackCounty = user?.county;
              if (!fallbackCounty) {
                setFeedbackMessage('Nem sikerült meghatározni a helyet.');
                setIsError(true);
                hideFeedbackLater();
                return;
              }

              query.county = fallbackCounty;
              const res = await axios.get('http://localhost:3001/lawyers/search', { params: query });
              setLawyers(res.data);
              if (res.data.length === 0) {
                setFeedbackMessage('Nincs megjeleníthető ügyvéd.');
                setIsError(false);
                hideFeedbackLater();
              }
            },
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0
            }
          );
        } else {
          setFeedbackMessage('A böngésződ nem támogatja a helymeghatározást.');
          setIsError(true);
          hideFeedbackLater();
        }
      } else if (locationType === 'county') {
        if (!county.trim()) {
          setFeedbackMessage('Adj meg egy megyét!');
          setIsError(true);
          hideFeedbackLater();
          return;
        }
        query.county = county.trim();
        const res = await axios.get('http://localhost:3001/lawyers/search', { params: query });
        setLawyers(res.data);
        if (res.data.length === 0) {
          setFeedbackMessage('Nincs megjeleníthető ügyvéd.');
          setIsError(false);
          hideFeedbackLater();
        }
      } else if (locationType === 'city') {
        if (!city.trim()) {
          setFeedbackMessage('Adj meg egy várost!');
          setIsError(true);
          hideFeedbackLater();
          return;
        }
        query.city = city.trim();
        const res = await axios.get('http://localhost:3001/lawyers/search', { params: query });
        setLawyers(res.data);
        if (res.data.length === 0) {
          setFeedbackMessage('Nincs megjeleníthető ügyvéd.');
          setIsError(false);
          hideFeedbackLater();
        }
      }

    } catch (err: any) {
      console.error('[ERROR]: Keresési hiba', err);
      setFeedbackMessage(err?.response?.data?.message || "Ismeretlen hiba történt!");
      setIsError(true);
      hideFeedbackLater();
    }
  };

  const hideFeedbackLater = () => {
    setTimeout(() => {
      setFeedbackMessage('');
      setIsError(null);
    }, 4000);
  };

  const handleStartChat = async (providerId: number, providerName: string) => {
    const user = getUser();
    if (!user) {
      setFeedbackMessage('Jelentkezzen be a chat használatához!');
      setIsError(true);
      hideFeedbackLater();
      return;
    }
  
    try {
      const res = await fetch('http://localhost:3001/messages/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seekerId: user.userType === 'seeker' ? user.id : providerId,
          providerId: user.userType === 'seeker' ? providerId : user.id,
        }),
      });
  
      const data = await res.json();
  
      navigate('/chat', {
        state: {
          selectedConversationId: data.conversationId,
          participant: {
            id: providerId,
            name: providerName,
          },
        },
      });
    } catch (err) {
      console.error('[ERROR]: Hiba a beszélgetés indításakor:', err);
      setFeedbackMessage('Hiba történt a beszélgetés indításakor!');
      setIsError(true);
      hideFeedbackLater();
    }
  };  

  return (
    <div className="main-page lexsearch-content">
      <div className="filter-row">
        <div className="search-card">Ügyvéd keresés</div>

        <div className="filter-group">
          <label>Szakterület:</label>
          <select value={selectedSpecialty ?? ''} onChange={(e) => setSelectedSpecialty(Number(e.target.value))}>
            <option value="">-- Válassz --</option>
            {lawyerTypes.map(type => (
              <option key={type.id} value={type.id}>{type.type}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Szűrés hely szerint:</label>
          <select value={locationType} onChange={(e) => setLocationType(e.target.value as any)}>
            <option value="nearby">Közelemben</option>
            <option value="county">Megye szerint</option>
            <option value="city">Város szerint</option>
          </select>
        </div>

        {locationType === 'county' && (
          <div className="filter-group">
            <label>Megye:</label>
            <input type="text" value={county} onChange={(e) => setCounty(e.target.value)} />
          </div>
        )}

        {locationType === 'city' && (
          <div className="filter-group">
            <label>Város:</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
        )}

        <button onClick={handleSearch} className="search-btn">Keresés</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {lawyers.map(lawyer => (
          <div key={lawyer.id} className="lawyer-card">
            <h4>{lawyer.name}</h4>
            <p>{lawyer.email}</p>
            <p>{lawyer.phone}</p>
            <p>{lawyer.city}, {lawyer.country}</p>
            <button onClick={() => handleStartChat(lawyer.id, lawyer.name)}>Beszélgetés</button>
          </div>
        ))}
      </div>

      {feedbackMessage && (
        <p className={`search-feedback ${isError ? 'error' : 'info'}`}>
          {feedbackMessage}
        </p>
      )}
    </div>
  );
};

export default LexSearch;