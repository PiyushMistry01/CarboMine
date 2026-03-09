import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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

      // 🔍 Now check if emissions already entered
      const emissionsRef = collection(db, "users", uid, "emissions");
      const snapshot = await getDocs(emissionsRef);

      if (!snapshot.empty) {
        // ✅ Emissions exist → go directly to dashboard
        navigate("/dashboard");
      } else {
        // ✅ Mine exists but no emissions yet
        navigate("/profile");
      }

    } else {
      // ❌ No mine info → first time setup
      navigate("/minesetup");
    }

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

const handleGoogleLogin = async () => {
  try {
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, provider);
    const uid = result.user.uid;

    // 🔍 Check if mine info exists
    const userDoc = await getDoc(doc(db, "users", uid));

    if (userDoc.exists() && userDoc.data().mineInfo) {

      const emissionsRef = collection(db, "users", uid, "emissions");
      const snapshot = await getDocs(emissionsRef);

      if (!snapshot.empty) {
        navigate("/dashboard");
      } else {
        navigate("/profile");
      }

    } else {
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
          <button
  type="button"
  className="google-btn"
  onClick={handleGoogleLogin}
>
  Continue with Google
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
