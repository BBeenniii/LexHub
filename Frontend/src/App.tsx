import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import MainPage from "./components/MainPage";
import Register from "./components/Register";
import Login from "./components/Login";
import Chat from "./components/Chat";
import AiChat from "./components/aiChat";
import { getUser } from "./utils/auth-utils";
import LexSearch from "./components/LexSearch";

const App: React.FC = () => {
  const user = getUser()

  return (
    <Router>
      <Navbar />
      <div className=" mt-4">
      <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/aiChat" element={<AiChat />} />
          <Route path="/lexSearch" element={<LexSearch />} />
          <Route path="/chat" element={<Chat />} />
      </Routes>
      </div>
    </Router>
  );
};

export default App;