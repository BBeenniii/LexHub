import React from "react";
import "../style/Footer.css";

const Footer: React.FC = () => {
    return (
        <>

<footer className="footer">
<div className="footer-content">
  <p>
    &copy; {new Date().getFullYear()} LexHub. All rights reserved. | 
    <a href="/privacy-policy"> Privacy Policy</a> | 
    <a href="/terms-of-service"> Terms of Service</a>
  </p>
</div>
</footer>
        </>
    );
}

export default Footer;