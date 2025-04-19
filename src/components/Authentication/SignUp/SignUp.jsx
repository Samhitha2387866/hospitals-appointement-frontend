import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUp.css";
 
const SignUp = () => {
  const [patientName, setPatientName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
 
    try {
      await axios.post("https://localhost:7130/api/PatientRegistration", {
        patientName,
        dateOfBirth,
        contactNumber,
        emergencyContact,
        gender,
        email,
        passwordHash: password, // Assuming password is hashed on the server side
        role: "patient" // Set role directly here
      });
 
      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    }
  };
 
  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign Up</h2>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Patient Name</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Date of Birth</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Contact Number</label>
            <input
              type="text"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Emergency Contact</label>
            <input
              type="text"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="signup-button">Sign Up</button>
        </form>
      </div>
    </div>
  );
};
 
export default SignUp;
 
 