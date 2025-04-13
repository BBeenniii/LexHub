import React from "react";
import "../style/Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          &copy; {new Date().getFullYear()} LexHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;