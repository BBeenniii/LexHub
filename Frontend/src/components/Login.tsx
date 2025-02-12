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
      const response = await axios.post("http://localhost:3001/login", {
        email,
        password,
      });
      const { token, user_id, name } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user_id", user_id);
      localStorage.setItem("user_name", name);

      alert(`Welcome ${name}!`);
      navigate("/chat");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="background">
      <div className="shape"></div>
      <div className="shape"></div>
      <form>
        <h3>Login Here</h3>

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

        <button className=" buttonski" type="button" onClick={handleLogin}>Log In</button>
        {error && <p className="error">{error}</p>}
        <div className="social">
          <div className="go"><i className="fab fa-google"></i> Google</div>
          <div className="fb"><i className="fab fa-facebook"></i> Facebook</div>
        </div>
      </form>
    </div>
  );
};

export default Login;
