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
  const [formData, setFormData] = useState({ ...user });
  const [lawyerTypes, setLawyerTypes] = useState<LawyerType[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

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
      specs: Array.isArray(prev.specs)
        ? prev.specs.includes(specId)
          ? prev.specs.filter((id) => id !== specId)
          : [...prev.specs, specId]
        : [specId],
    }));
  };

  const handleSave = async () => {
  if (!user) return;

  const updatedFields: any = {};

  if (formData.name !== user.name) updatedFields.name = formData.name;
  if (formData.email !== user.email) updatedFields.email = formData.email;
  if (formData.phone !== user.phone) updatedFields.phone = formData.phone;
  if (formData.country !== user.country) updatedFields.country = formData.country;
  if (formData.county !== user.county) updatedFields.county = formData.county;
  if (formData.city !== user.city) updatedFields.city = formData.city;

  if (
    user.userType === 'provider' &&
    JSON.stringify(formData.specs) !== JSON.stringify(user.specs)
  ) {
    updatedFields.specs = formData.specs;
  }

  // Jelszó változtatás logika
  if (newPassword) {
    if (!currentPassword) {
      setMessage('A jelszó módosításhoz add meg a jelenlegi jelszavad!');
      setIsSuccess(false);
      return;
    }
    updatedFields.currentPassword = currentPassword;
    updatedFields.newPassword = newPassword;
  }

  if (Object.keys(updatedFields).length === 0) {
    setMessage('Nincs módosított adat.');
    setIsSuccess(false);
    setTimeout(() => {
      setMessage('');
      setIsSuccess(null);
    }, 4000);
    return;
  }

  try {
    const res = await fetch(`http://localhost:3001/auth/profile/${user.userType}/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFields),
    });

    if (!res.ok) {
      const error = await res.json();
      setMessage('Mentési hiba: ' + (error.message || 'Ismeretlen hiba.'));
      setIsSuccess(false);
      setTimeout(() => {
        setMessage('');
        setIsSuccess(null);
      }, 4000);
      return;
    }

    const updatedUser = await res.json();
    setUser(updatedUser);
    setMessage('Profil sikeresen frissítve!');
    setIsSuccess(true);
    setEditMode(false);
    setNewPassword('');
    setCurrentPassword('');
    setTimeout(() => {
      setMessage('');
      setIsSuccess(null);
    }, 4000);
  } catch (err) {
    setMessage('Hálózati hiba történt.');
    setIsSuccess(false);
    setTimeout(() => {
      setMessage('');
      setIsSuccess(null);
    }, 4000);
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
      setNewPassword('');
      setCurrentPassword('');
    }
    setEditMode(false);
    setMessage('');
    setIsSuccess(null);
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
        <input name="name" value={formData.name} onChange={handleChange} disabled={!editMode} />

        <label>Email</label>
        <input name="email" value={formData.email} onChange={handleChange} disabled={!editMode} />

        <label>Telefonszám</label>
        <input name="phone" value={formData.phone} onChange={handleChange} disabled={!editMode} />

        <label>Ország</label>
        <input name="country" value={formData.country} onChange={handleChange} disabled={!editMode} />

        <label>Megye</label>
        <input name="county" value={formData.county} onChange={handleChange} disabled={!editMode} />

        <label>Város</label>
        <input name="city" value={formData.city} onChange={handleChange} disabled={!editMode} />

        <label>Új jelszó</label>
        <input type="password" name="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={!editMode} />

        <label>Jelenlegi jelszó</label>
        <input type="password" name="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} disabled={!editMode} />

        {user.userType === 'provider' && (
          <>
            <label>Szakterületek</label>
            <div className="spec-checkboxes">
              {lawyerTypes.map((spec) => (
                <label key={spec.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.specs?.includes(spec.id) || false}
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

        {message && (
          <p className={`profile-feedback ${isSuccess ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
