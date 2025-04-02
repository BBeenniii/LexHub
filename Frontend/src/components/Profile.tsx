import React, { useEffect, useState } from 'react';
import { getUser } from '../utils/auth-utils';
import '../style/Profile.css';

interface UserData {
  id: number;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  county?: string;
  city?: string;
  userType: 'seeker' | 'provider';
  specs?: number[];
  specNames?: string[];
}

interface LawyerType {
  id: number;
  type: string;
}

const Profile: React.FC = () => {
  const storedUser = getUser();
  const [user, setUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    county: '',
    city: '',
    specs: [] as number[],
  });
  const [lawyerTypes, setLawyerTypes] = useState<LawyerType[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!storedUser) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:3001/auth/profile/${storedUser.id}`);
        const data = await res.json();
        setUser(data);
        if (!editMode) {
          setFormData({
            name: data.name,
            email: data.email,
            phone: data.phone || '',
            country: data.country || '',
            county: data.county || '',
            city: data.city || '',
            specs: data.specs || [],
          });
        }
      } catch (err) {
        console.error('Profil lekérési hiba:', err);
      }
    };

    const fetchLawyerTypes = async () => {
      try {
        const res = await fetch('http://localhost:3001/auth/lawyertypes');
        const data = await res.json();
        setLawyerTypes(data);
      } catch (err) {
        console.error('Szakterületek lekérési hiba:', err);
      }
    };

    fetchProfile();
    fetchLawyerTypes();
  }, [storedUser, editMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSpec = (specId: number) => {
    setFormData((prev) => ({
      ...prev,
      specs: prev.specs.includes(specId)
        ? prev.specs.filter((id) => id !== specId)
        : [...prev.specs, specId],
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    const payload: any = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      county: formData.county,
      city: formData.city,
    };

    if (user.userType === 'provider') {
      payload.specs = formData.specs;
    }

    try {
      const res = await fetch(`http://localhost:3001/auth/profile/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      setMessage(result.message || 'Sikeres frissítés!');
      setEditMode(false);
    } catch (err) {
      console.error('Mentési hiba:', err);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        country: user.country || '',
        county: user.county || '',
        city: user.city || '',
        specs: user.specs || [],
      });
    }
    setEditMode(false);
  };

  if (!user) {
    return (
      <div className="profile-wrapper">
        <p>Be kell jelentkezni a profil megtekintéséhez.</p>
      </div>
    );
  }

  return (
    <div className="profile-wrapper">
      <h2>Profilom</h2>
      <div className="profile-card">
        <label>Név</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled={!editMode}
        />

        <label>Email</label>
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={!editMode}
        />

        <label>Telefonszám</label>
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          disabled={!editMode}
        />

        <label>Ország</label>
        <input
          name="country"
          value={formData.country}
          onChange={handleChange}
          disabled={!editMode}
        />

        <label>Megye</label>
        <input
          name="county"
          value={formData.county}
          onChange={handleChange}
          disabled={!editMode}
        />

        <label>Város</label>
        <input
          name="city"
          value={formData.city}
          onChange={handleChange}
          disabled={!editMode}
        />

        {user.userType === 'provider' && (
          <>
            <label>Szakterületek</label>
            <div className="spec-checkboxes">
              {lawyerTypes.map((spec) => (
                <label key={spec.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.specs.includes(spec.id)}
                    onChange={() => toggleSpec(spec.id)}
                    disabled={!editMode}
                  />
                  {spec.type}
                </label>
              ))}
            </div>
          </>
        )}

        <div className="profile-buttons">
          {editMode ? (
            <>
              <button onClick={handleSave}>Mentés</button>
              <button className="cancel" onClick={handleCancel}>Mégse</button>
            </>
          ) : (
            <button onClick={() => setEditMode(true)}>Szerkesztés</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;