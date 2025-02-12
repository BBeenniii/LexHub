import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:3001/register", {
        name,
        email,
        password,
      });
      alert("Registration successful!");
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="background">
      <form>
        <h3>Register Here</h3>

        <label htmlFor="name">Name</label>
        <input
          type="text"
          placeholder="Name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="email">Email</label>
        <input
          type="text"
          placeholder="Email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="buttonski" type="button" onClick={handleRegister}>Register</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default Register;