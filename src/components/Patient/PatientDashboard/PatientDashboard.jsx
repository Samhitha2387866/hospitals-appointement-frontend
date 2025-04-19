// src/components/patient/PatientDashboard/PatientDashboard.jsx
import React, { useState, useEffect } from 'react';
import './PatientDashboard.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Profile from '../PatientProfile/PatientProfile';
import BookAppointment from '../BookAppointment/BookAppointment';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import Error from '../../common/Error/Error';
import MedicalHistory from '../MedicalHistory/MEdicalHistory';
import Notifications from '../Notifications/Notifications';

function PatientDashboard() {
  const [activeSection, setActiveSection] = useState('profile');
  const [patientData, setPatientData] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointmentData, setAppointmentData] = useState({
    doctorId: '',
    patientId: '',
    appointmentDate: '',
    appointmentTime: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('userType');
      const userEmail = localStorage.getItem('userEmail');

      if (!token || !userEmail || userType !== 'patient') {
        navigate('/login');
        return;
      }

      try {
        const patientResponse = await fetch('https://localhost:7130/api/PatientRegistration', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!patientResponse.ok) throw new Error('Failed to fetch patient details');

        const patientsData = await patientResponse.json();
        const patient = patientsData.find(p => p.email.toLowerCase() === userEmail.toLowerCase());

        if (!patient) {
          throw new Error('Patient not found');
        }
        setPatientData(patient);
        
        setAppointmentData(prev => ({
          ...prev,
          patientId: patient.patientId
        }));

        const doctorsResponse = await fetch('https://localhost:7130/api/DoctorRegistration', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!doctorsResponse.ok) throw new Error('Failed to fetch doctors');
        const doctorsData = await doctorsResponse.json();
        setDoctors(doctorsData);

      } catch (err) {
        setError(err.message);
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [navigate]);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
  
    if (!appointmentData.doctorId || !appointmentData.appointmentDate || !appointmentData.appointmentTime) {
      alert('Please fill in all the required fields');
      return;
    }
  
    try {
      const formattedDate = new Date(appointmentData.appointmentDate).toISOString().split('T')[0];
      const formattedTime = `${appointmentData.appointmentTime}:00`;
  
      const bookingData = {
        doctorId: parseInt(appointmentData.doctorId, 10),
        patientId: parseInt(appointmentData.patientId, 10),
        appointmentDate: formattedDate,
        appointmentTime: formattedTime,
        status: 'Scheduled'
      };
  
      const response = await fetch('https://localhost:7130/api/Appointments/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to book appointment: ${errorText || response.statusText}`);
      }
  
      alert('Appointment booked successfully!');
  
      setAppointmentData(prev => ({
        ...prev,
        doctorId: '',
        appointmentDate: '',
        appointmentTime: ''
      }));
      setActiveSection('profile');
    } catch (error) {
      console.error('Booking error:', error.message);
      alert(`An error occurred while booking the appointment: ${error.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const renderContent = () => {
    if (!patientData) return null;

    switch (activeSection) {
      case 'book':
        return (
          <BookAppointment 
            appointmentData={appointmentData} 
            setAppointmentData={setAppointmentData} 
            doctors={doctors} 
            handleBookAppointment={handleBookAppointment} 
          />
        );

      case 'profile':
        return <Profile patientData={patientData} />;

      case 'medicalHistory':
        return <MedicalHistory patientId={patientData.patientId} />;

      case 'notifications':
        return <Notifications patientId={patientData.patientId} />;

      default:
        return null;
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <Error message={error} />;

  return (
    <div className="patient-dashboard">
      <Navbar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        handleLogout={handleLogout} 
        patientName={patientData ? patientData.name : 'Patient'}
      />
  
      <div className="main-content-wrapper">
        <div className="marquee-container">
          <div className="marquee-text">
            Welcome to the Patient Dashboard - Book your appointments easily
          </div>
        </div>
  
        <div className="main-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;