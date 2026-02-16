import React from "react";
import "./Login.css"; // You can reuse same CSS
import { Link } from "react-router-dom";


const Signup = () => {
  return (
    <div className="login-container">
      <div className="login-card">
        <h1>CarboMine</h1>
        <p className="subtitle">Welcome</p>

        <form>
          
          <div className="input-group">
            <input type="email" placeholder="Email" required />
          </div>

          <div className="input-group">
            <input type="password" placeholder="Password" required />
          </div>

          <button className="login-btn">Signup</button>
        </form>
        <p className="footer-text">
            Already a member? <Link to="/login">Login!</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
