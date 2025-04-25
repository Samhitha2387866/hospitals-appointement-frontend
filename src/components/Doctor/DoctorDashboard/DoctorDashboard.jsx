import React, { useState, useEffect } from 'react';
import './DoctorDashboard.css';
import { useNavigate } from 'react-router-dom';
import ScheduledAppointments from '../Appointments/ScheduledAppointments';
import AddTimeSlots from '../TimeSlots/AddTimeSlots';
import ReviewTimeSlots from '../TimeSlots/ReviewTimeSlots';
 
function DoctorDashboard() {
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('appointments'); // Default section
  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchInitialData = async () => {
      const token = localStorage.getItem('token');
      const userEmail = localStorage.getItem('userEmail');
 
      if (!token || !userEmail) {
        navigate('/login');
        return;
      }
 
      try {
        const response = await fetch('https://localhost:7130/api/DoctorRegistration', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
 
        if (!response.ok) throw new Error('Failed to fetch doctor details');
 
        const data = await response.json();
        const doctor = data.find(d => d.email.toLowerCase() === userEmail.toLowerCase());
 
        if (!doctor) throw new Error('Doctor not found');
        setDoctorData(doctor);
 
      } catch (err) {
        setError(err.message);
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
 
    fetchInitialData();
  }, [navigate]);
 
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };
 
  const handleProfileClick = () => {
    const doctorId = doctorData?.doctorId;
    if (doctorId) {
      navigate(`/doctor-dashboard/profile/${doctorId}`);
    }
  };
 
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
 
  return (
    <div className="doctor-dashboard">
      <div className="navbar">
        <div className="logo">Cognizant Healthcare</div>
        <div className="navbar-buttons">
          <button onClick={() => setActiveSection('appointments')}>Appointments</button>
          <button onClick={() => setActiveSection('add-slots')}>Add Time Slots</button>
          <button onClick={() => setActiveSection('review-slots')}>Review Time Slots</button>
          <button onClick={() => setActiveSection('profile')} >Profile</button>
        </div>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
 
      <div className="welcome-message">
      <h3>Welcome, Dr. {doctorData?.doctorName}</h3>
            </div>
 
      <div className="appointments-section">
        {activeSection === 'appointments' && <ScheduledAppointments doctorId={doctorData?.doctorId} />}
        {activeSection === 'add-slots' && <AddTimeSlots doctorId={doctorData?.doctorId} />}
        {activeSection === 'review-slots' && <ReviewTimeSlots doctorId={doctorData?.doctorId} />}
        {activeSection === 'profile' && (
          <div className="profile-section">
            <h2>Profile</h2>
            <p>Name: {doctorData?.doctorName}</p>
            <p>Specialization: {doctorData?.specialization}</p>
            <p>Email: {doctorData?.email}</p>
            <p>Phone Number: {doctorData?.contactNumber}</p>
   
            <button onClick={handleProfileClick}>Edit Profile</button>
          </div>
        )}
      </div>
    </div>
  );
}
 
export default DoctorDashboard;
 