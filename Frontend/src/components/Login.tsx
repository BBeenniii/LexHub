import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await axios.post("http://localhost:3001/login", {
        email,
        password,
      });
      navigate("/aiChat");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="background">
      <form className="login-form">
        <h3>Login</h3>

        <label htmlFor="email">Email</label>
        <input
          type="text"
          placeholder="Email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          placeholder="Password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="buttonski" type="button" onClick={handleLogin}>Login</button>
        {error && <p className="error">{error}</p>}
        <div className="social">
            <div className="go"><i className="fab fa-google"></i><a href="https://www.google.com" target="_blank" rel="noopener noreferrer">Google</a> </div>
            <div className="fb"><i className="fab fa-facebook"></i><a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"> Facebook</a> </div>
            <div className="ig"><i className="fab fa-instagram"></i><a href="https://instagram.com" target="_blank" rel="noopener noreferrer"> Instagram</a> </div>
        </div>
      </form>
    </div>
  );
};

export default Login;