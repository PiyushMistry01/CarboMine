import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import MethaneForm from "./MethaneForm";
import ProgressCard from "./ProgressCard";
import "./profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [mineName, setMineName] = useState("");
  const [showForm, setShowForm] = useState(false);

  // ✅ STEP state moved here
  const [step, setStep] = useState(1);

  useEffect(() => {
    const fetchMine = async () => {
      const user = auth.currentUser;

      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setMineName(docSnap.data().mineInfo?.name);
        }
      }
    };

    fetchMine();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="profile-container">

      <nav className="navbar">
        <h2 className="logo">CarboMine</h2>
        <button className="signout-btn" onClick={handleSignOut}>
          Sign Out
        </button>
      </nav>

      <div className="mine-section">
        <h1>{mineName}</h1>

        {!showForm && (
          <button
            className="carbon-btn"
            onClick={() => setShowForm(true)}
          >
            Calculate Carbon Emission
          </button>
        )}
      </div>

      {showForm && (
        <div className="AlignForm">

          {/* LEFT FORM */}
          <MethaneForm step={step} setStep={setStep} />

          {/* RIGHT PROGRESS */}
          <ProgressCard currentStep={step} />

        </div>
      )}
    </div>
  );
};

export default Profile;