import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
  e.preventDefault();

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      form.email,
      form.password
    );

    // ✅ Redirect immediately
    navigate("/login");

    // Save to Firestore in background
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: form.email,
      createdAt: new Date(),
    });

    alert("Signup successful!");

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};



  return (
    <div className="login-container">
      <div className="login-card">
        <h1>CarboMine</h1>
        <p className="subtitle">Create your account</p>

        <form onSubmit={handleSignup}>
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
            Signup
          </button>
        </form>

        <p className="footer-text">
          Already a member? <Link to="/">Login!</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
