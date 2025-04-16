import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style/Register.css';

const Register: React.FC = () => {
  const [userType, setUserType] = useState<'seeker' | 'provider'>('seeker');
  const [providerType, setProviderType] = useState<'individual' | 'company'>('individual');
  const [specialtiesEnabled, setSpecialtiesEnabled] = useState(false);
  const [lawyerTypes, setLawyerTypes] = useState<{ id: number; type: string }[]>([]);
  const [feedbackMessages, setFeedbackMessages] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    country: '',
    county: '',
    city: '',
    password: '',
    confirmPassword: '',
    kasz: '',
    specs: [] as number[],
  });
//A szakterületek lekérdezése a backendről
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/auth/lawyertypes').then(response => {
      setLawyerTypes(response.data);
    });
  }, []);
 //A bemenő adatok beállítása a regisztrációs űrlapra
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  //A szakterületek kezelése
  const handleSpecialtiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = Number(e.target.value);
    setFormData(prev => ({
      ...prev,
      specs: e.target.checked
        ? [...prev.specs, id]
        : prev.specs.filter(specId => specId !== id),
    }));
  };
  //A bemenő adatok validálása
  const validateInput = () => {
    const errors: string[] = [];

    const nameParts = formData.name.trim().split(' ');
    if (nameParts.length < 2 || nameParts.some(part => part.length < 2)) {
      errors.push('A teljes névnek legalább két tagból kell állnia, és minden tagnak legalább 2 betűből.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.push('Érvénytelen email cím.');
    }

    const phoneRegex = /^\+?[0-9]+$/;
    if (!phoneRegex.test(formData.phone)) {
      errors.push('A telefonszám csak számokat és opcionálisan + jelet tartalmazhat.');
    }

    if (formData.password !== formData.confirmPassword) {
      errors.push('A jelszavak nem egyeznek.');
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      errors.push('A jelszónak legalább 8 karakter hosszúnak kell lennie, kis- és nagybetűt, számot és speciális karaktert kell tartalmaznia.');
    }

    if (errors.length > 0) {
      setFeedbackMessages(errors);
      setIsSuccess(false);
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateInput()) return;

    const endpoint = userType === 'seeker' ? 'register/seeker' : 'register/provider';

    const postData: any = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      county: formData.county,
      city: formData.city,
      password: formData.password,
    };
     //Provider specifikus adatok
    if (userType === 'provider') {
      postData.kasz = formData.kasz;
      postData.providerType = providerType;
      if (providerType === 'company') {
        postData.companyName = formData.companyName;
      }
      postData.specs = specialtiesEnabled ? formData.specs : formData.specs.slice(0, 1);
    }
    
    //A regisztrációs adatok elküldése a backendnek
    try {
      await axios.post(`http://localhost:3001/auth/${endpoint}`, postData);
      setFeedbackMessages(['Sikeres regisztráció!']);
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      const errors = Array.isArray(msg) ? msg : [msg || 'Hiba történt a regisztráció során.'];
      setFeedbackMessages(errors);
      setIsSuccess(false);
    }
  };

  return (
    <div className="register-container">
      <h3>Regisztráció</h3>

      <label>Felhasználó típusa:</label>
      <select value={userType} onChange={(e) => setUserType(e.target.value as 'seeker' | 'provider')}>
        <option value="seeker">Jogi segítséget keresek</option>
        <option value="provider">Jogi segítséget nyújtok</option>
      </select>

      {userType === 'provider' && (
        <>
          <label>Szolgáltató típusa:</label>
          <select name="providerType" value={providerType} onChange={(e) => setProviderType(e.target.value as 'individual' | 'company')}>
            <option value="individual">Egyéni</option>
            <option value="company">Vállalkozás</option>
          </select>

          {providerType === 'company' && (
            <>
              <label>Cég neve:</label>
              <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} />
            </>
          )}

          <label>KASZ (Kamarai Azonosító Szám):</label>
          <input type="text" name="kasz" value={formData.kasz} onChange={handleChange} />

          <label>
            <input type="checkbox" onChange={() => setSpecialtiesEnabled(!specialtiesEnabled)} />
            További szakterületeket választok
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lawyerTypes.map(lawyer => (
              <label
                key={lawyer.id}
                className="flex items-center bg-white/10 backdrop-blur-md p-3 rounded-lg shadow-md text-white text-sm gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={lawyer.id}
                  onChange={handleSpecialtiesChange}
                  disabled={!specialtiesEnabled && formData.specs.length >= 1}
                  checked={formData.specs.includes(lawyer.id)}
                  className="w-4 h-4 accent-white"
                />
                {lawyer.type}
              </label>
            ))}
          </div>
        </>
      )}

      <label>Teljes név:</label>
      <input type="text" name="name" value={formData.name} onChange={handleChange} />

      <label>Email:</label>
      <input type="email" name="email" value={formData.email} onChange={handleChange} />

      <label>Telefonszám:</label>
      <input type="text" name="phone" value={formData.phone} onChange={handleChange} />

      <label>Ország:</label>
      <input type="text" name="country" value={formData.country} onChange={handleChange} />

      <label>Megye:</label>
      <input type="text" name="county" value={formData.county} onChange={handleChange} />

      <label>Város:</label>
      <input type="text" name="city" value={formData.city} onChange={handleChange} />

      <label>Jelszó:</label>
      <input type="password" name="password" value={formData.password} onChange={handleChange} />

      <label>Jelszó újra:</label>
      <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />

      <button onClick={handleRegister}>Regisztráció</button>

      {feedbackMessages.length > 0 && (
        <div className={`register-feedback ${isSuccess ? 'success' : 'error'}`}>
          {feedbackMessages.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Register;
