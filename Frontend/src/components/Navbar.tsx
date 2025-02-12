<<<<<<< HEAD
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.scss";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

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
            <li className="nav-item">
              <Link className="nav-link" to="/register">
                Register
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/chat">
                Chat
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

=======
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.scss"; // Egyedi CSS importálása

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

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
            <li className="nav-item">
              <Link className="nav-link" to="/register">
                Register
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/chat">
                Chat
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

>>>>>>> bd8d9aa2fa9dcbf4d8d245206814e44b71cfe77a
export default Navbar;