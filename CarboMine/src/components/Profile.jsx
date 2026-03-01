import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";

import MethaneForm from "./MethaneForm";
import ProgressCard from "./ProgressCard";
import "./profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [mineName, setMineName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const fetchMine = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setMineName(docSnap.data().mineInfo?.name);
      }
    };

    fetchMine();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/login");
  };

  // ✅ CSV Upload Handler
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        let totalCoal = 0;
        let totalDiesel = 0;
        let totalElectricity = 0;
        let totalExplosives = 0;

        results.data.forEach((row) => {
          totalCoal += Number(row.coal || 0);
          totalDiesel += Number(row.diesel || 0);
          totalElectricity += Number(row.electricity || 0);
          totalExplosives += Number(row.explosives || 0);
        });

        // Same emission formulas you already use
        const methane = (totalCoal * 15 * 0.67) / 1000;
        const dieselEmission = (totalDiesel * 2.68) / 1000;
        const electricityEmission = (totalElectricity * 0.82) / 1000;
        const explosiveEmission = totalExplosives * 0.0005;

        const total =
          methane +
          dieselEmission +
          electricityEmission +
          explosiveEmission;

        const user = auth.currentUser;

        await addDoc(
          collection(db, "users", user.uid, "emissions"),
          {
            methane,
            diesel: dieselEmission,
            electricity: electricityEmission,
            explosives: explosiveEmission,
            total,
            createdAt: serverTimestamp(),
          }
        );

        navigate("/dashboard", {
          state: {
            methane,
            diesel: dieselEmission,
            electricity: electricityEmission,
            explosives: explosiveEmission,
          },
        });
      },
    });
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
          <>
            <button
              className="carbon-btn"
              onClick={() => setShowForm(true)}
            >
              Calculate Carbon Emission Manually
            </button>

            <div className="csv-section">
              <p>OR</p>
              <label className="csv-upload">
                Upload CSV File
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  hidden
                />
              </label>
            </div>
          </>
        )}
      </div>

      {showForm && (
        <div className="AlignForm">
          <MethaneForm step={step} setStep={setStep} />
          <ProgressCard currentStep={step} />
        </div>
      )}
    </div>
  );
};

export default Profile;