// src/components/Navbar/Navbar.jsx
import React from 'react';
import './Navbar.css';

function Navbar({ activeSection, setActiveSection, handleLogout, patientName }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Cognizant Healthcare</div>
      <ul className="navbar-list">
        <li>
          <button onClick={() => setActiveSection('book')}>Book Appointment</button>
        </li>
        <li>
          <button onClick={() => setActiveSection('medicalHistory')}>Medical History</button>
        </li>
        <li>
          <button onClick={() => setActiveSection('notifications')}>Notifications</button>
        </li>
        <li>
          <button onClick={() => setActiveSection('profile')}>Profile</button>
        </li>
        <li>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;