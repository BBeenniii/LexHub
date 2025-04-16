import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style/Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const navigate = useNavigate();

  //Bejelentkezés küldése a szervernek, ha sikeres felhasználói adatok mentése a localStorage-ba
  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:3001/auth/login', {
        email,
        password,
      });
      
      setFeedbackMessage('Sikeres bejelentkezés!');
      setIsSuccess(true);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err: any) {
      setFeedbackMessage(err.response?.data?.message || 'Hiba történt a bejelentkezés során.');
      setIsSuccess(false);
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

      {feedbackMessage && (
        <p className={`login-feedback ${isSuccess ? 'success' : 'error'}`}>
          {feedbackMessage}
        </p>
      )}
    </div>
  );
};

export default Login;
