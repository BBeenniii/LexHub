import React from "react";
import "./Navbar.scss";
import "./MainPage.css";
import Footer from "./Footer";

const MainPage: React.FC = () => {
  return (
    <>
      <div className="main-page">
        <div className="text-center">
          <h1 className="display-4 animated-title">Welcome to LexHub</h1>
          <p className="lead animated-text">Connect with your lawyer securely and efficiently.</p>
        </div>
      </div>

      <div className="features-position">
        <div className="main-page">
          <div className="features-center">
            <h1 className="display-8 animated-title">Features</h1>
          </div>

          <div className="features">
              <div className="feature">
                <h2>Secure Messaging</h2>
                <p>Communicate with your lawyer through our encrypted messaging system.</p>
              </div>
              <div className="feature">
                <h2>Document Sharing</h2>
                <p>Upload and share important documents securely with your lawyer.</p>
              </div>
              <div className="feature">
                <h2>Appointment Sched uling</h2>
                <p>Schedule and manage your appointments with ease.</p>
              </div>
            </div>
          </div>
        </div>

        <div>
        <Footer></Footer>
      </div>
    </>
  );
};

export default MainPage;