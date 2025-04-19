// src/components/common/Sidebar/Sidebar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ activeSection, setActiveSection }) => {
  const navigate = useNavigate();
  const userType = localStorage.getItem('userType');

  const renderDoctorMenu = () => (
    <>
      <button 
        className={activeSection === 'overview' ? 'active' : ''}
        onClick={() => setActiveSection('overview')}
      >
        Dashboard Overview
      </button>
      <button 
        className={activeSection === 'appointments' ? 'active' : ''}
        onClick={() => setActiveSection('appointments')}
      >
        Appointments
      </button>
      <button 
        className={activeSection === 'timeSlots' ? 'active' : ''}
        onClick={() => setActiveSection('timeSlots')}
      >
        Manage Time Slots
      </button>
    </>
  );

  const renderPatientMenu = () => (
    <>
      <button onClick={() => navigate('/patient-dashboard')}>
        Dashboard
      </button>
      <button onClick={() => navigate('/patient-dashboard/book-appointment')}>
        Book Appointment
      </button>
      <button onClick={() => navigate('/patient-dashboard/medical-history')}>
        Medical History
      </button>
    </>
  );

  return (
    <div className="sidebar">
      <div className="sidebar-menu">
        {userType === 'doctor' ? renderDoctorMenu() : renderPatientMenu()}
        <button onClick={() => navigate(`/${userType}-dashboard/profile`)}>
          Profile
        </button>
      </div>
    </div>
  );
};

export default Sidebar;