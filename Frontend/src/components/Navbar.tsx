import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/Navbar.scss";
import { getUser, isLoggedIn, logout } from "../utils/auth-utils";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = getUser();
  const loggedIn = isLoggedIn();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header>
      <div className="container navbar">
        <Link to="/" className="nav-link">
          <h1 className="logo">LexHub</h1>
        </Link>
        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
        <nav className={isOpen ? "open" : ""}>
          <ul>
            {!loggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Regisztráció</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Bejelentkezés</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/lexSearch">Lex Search</Link>
                </li>
              </>
            )}

            {loggedIn && (
              <>
                {user?.userType === "seeker" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/lexSearch">Lex Search</Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">Profil</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/chat">Chatek</Link>
                </li>
                <li className="nav-item">
                  <button className="nav-link logout-button" onClick={handleLogout}>
                    Kijelentkezés
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;