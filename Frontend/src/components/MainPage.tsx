import React from "react";
import "../style/Navbar.scss";
import "../style/MainPage.css";
import Footer from "./Footer";

const MainPage: React.FC = () => {
  return (
    <div className="page-wrapper">
      <div className="main-page">
        <div className="text-center">
          <h1 className="display-4 animated-title">LexHub</h1>
          <p className="lead animated-text">
            Találjon jogi képviselőt, bárhol, bármilyen esetre!
          </p>
        </div>
      </div>
      <div className="footer-main">
        <Footer />
      </div>
    </div>
  );
};

export default MainPage;