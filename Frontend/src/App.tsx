import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import AiChat from "./components/aiChat";
import MainPage from "./components/MainPage";
import Register from "./components/Register";
import Login from "./components/Login";
import { getUser } from "./utils/auth-utils";
import LexSearch from "./components/LexSearch";
import ChatsPage from "./components/ChatPage";
import SocketProvider from "./context/SocketContext";
import Profile from "./components/Profile";


const App: React.FC = () => {
  const user = getUser()

  return (
    <SocketProvider>
      <Router>
        <Navbar />
        <div className="mt-4">
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/aiChat" element={<AiChat />} />
            <Route path="/lexSearch" element={<LexSearch />} />
            <Route path="/profile" element={<Profile/>} />
            <Route
              path="/chat"
              element={
                user ? <ChatsPage /> : <Navigate to="/chat" replace />
              }
            />
          </Routes>
        </div>
      </Router>
      </SocketProvider>
  );
};

export default App;