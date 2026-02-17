import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";


import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      form.email,
      form.password
    );

    const uid = userCredential.user.uid;

    // 🔍 Check if mine info exists
    const userDoc = await getDoc(doc(db, "users", uid));

    if (userDoc.exists() && userDoc.data().mineInfo) {
      // Mine already added → go to profile
      navigate("/profile");
    } else {
      // First time user → go to mine setup form
      navigate("/minesetup");
    }

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};


  return (
    <div className="login-container">
      <div className="login-card">
        <h1>CarboMine</h1>
        <p className="subtitle">Welcome</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <p className="footer-text">
          New member? <Link to="/signup">Signup!</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
