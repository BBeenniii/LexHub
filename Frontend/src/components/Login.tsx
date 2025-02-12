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
      alert("Login successful!");
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="card mx-auto" style={{ maxWidth: "400px" }}>
      <div className="card-body">
        <h2 className="card-title text-center">Login</h2>
        {isLoggedIn ? (
          <div>
            <p>You are already logged in.</p>
            <button className="btn btn-danger w-100" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="btn btn-primary w-100" onClick={handleLogin}>
              Login
            </button>
            {error && <p className="text-danger mt-3">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
