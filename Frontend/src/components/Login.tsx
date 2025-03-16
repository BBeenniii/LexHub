import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [userType, setUserType] = useState<'seeker' | 'provider'>('seeker');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:3001/auth/login', {
        userType,
        email,
        password,
      });
      alert(res.data.message);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate('/');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Hiba történt a bejelentkezés során.');
    }
  };

  return (
    <div className="login-container">
      <h3>Bejelentkezés</h3>

      <label>Felhasználó típusa:</label>
      <select value={userType} onChange={(e) => setUserType(e.target.value as 'seeker' | 'provider')}>
        <option value="seeker">Jogi segítséget keresek</option>
        <option value="provider">Jogi segítséget nyújtok</option>
      </select>

      <label>Email:</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

      <label>Jelszó:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <button onClick={handleLogin}>Bejelentkezés</button>
    </div>
  );
};

export default Login;
