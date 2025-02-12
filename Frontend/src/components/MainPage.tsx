import React from "react";
import { Link } from "react-router-dom";

const MainPage: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="display-4">Welcome to LexHub</h1>
      <p className="lead">Connect with your lawyer securely and efficiently.</p>
      <div className="mt-4">
        <Link to="/register" className="btn btn-primary btn-lg mx-2">
          Register
        </Link>
        <Link to="/login" className="btn btn-secondary btn-lg mx-2">
          Login
        </Link>
      </div>
    </div>
  );
};

export default MainPage;