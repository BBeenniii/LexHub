import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style/Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:3001/auth/login', {
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
    <div className="login-form">
      <h3>Bejelentkezés</h3>

      <label>Email:</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

      <label>Jelszó:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <button className="buttonski" onClick={handleLogin}>Bejelentkezés</button>
    </div>
  );
};

export default Login;