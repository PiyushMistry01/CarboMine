import React, { useState } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./mineSetup.css";

const MineSetup = () => {
  const navigate = useNavigate();

  const [mine, setMine] = useState({
    name: "",
    location: "",
    type: ""
  });

  const handleChange = (e) => {
    setMine({ ...mine, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;

    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          mineInfo: mine,
          setupComplete: true
        },
        { merge: true }
      );

      console.log("Mine saved successfully");

      navigate("/profile");

    } catch (error) {
      console.error("Error saving mine:", error);
    }
  };

  return (
    <div className="minesetup-container">
      <div className="minesetup-card">

        <h1>Welcome</h1>
        <p className="minesetup-subtitle">Setup Your Mine</p>

        <form onSubmit={handleSubmit}>

          {/* Mine Name */}
          <div className="minesetup-input">
            <input
              type="text"
              name="name"
              placeholder="Mine Name"
              onChange={handleChange}
              required
            />
          </div>

          {/* Location */}
          <div className="minesetup-input">
            <input
              type="text"
              name="location"
              placeholder="Location"
              onChange={handleChange}
              required
            />
          </div>

          {/* Mine Type Dropdown */}
          <div className="minesetup-input">
            <select
              name="type"
              onChange={handleChange}
              required
              defaultValue=""
            >
              <option value="" disabled>
                Select Mine Type
              </option>
              <option value="Opencast">Opencast</option>
              <option value="Underground">Underground</option>
            </select>
          </div>

          <button type="submit" className="minesetup-btn">
            Save & Continue
          </button>

        </form>

        <p className="minesetup-footer">
          This setup will appear only once.
        </p>

      </div>
    </div>
  );
};

export default MineSetup;
