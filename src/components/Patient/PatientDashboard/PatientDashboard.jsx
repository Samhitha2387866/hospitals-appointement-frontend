import React, { useState, useEffect } from 'react';
import './PatientDashboard.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Navbar from '../Navbar/Navbar';
import BookAppointment from '../BookAppointment/BookAppointment';
import MedicalHistory from '../MedicalHistory/MEdicalHistory';
import Notifications from '../Notifications/Notifications';
import Profile from '../PatientProfile/PatientProfile';
import MyAppointments from '../MyAppointments/MyAppointments';

import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import Error from '../../common/Error/Error';

function PatientDashboard() {
  const [activeSection, setActiveSection] = useState('book');
  const [patientData, setPatientData] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // Error is always a string
  const [appointmentData, setAppointmentData] = useState({
    doctorId: '',
    patientId: '',
    appointmentDate: '',
    appointmentTime: ''
  });

  const navigate = useNavigate();

  // Fetch patient profile & doctor list on mount
  useEffect(() => {
    async function fetchInitialData() {
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('userType');
      const userEmail = localStorage.getItem('userEmail');
      if (!token || !userEmail || userType !== 'patient') {
        localStorage.clear();
        navigate('/login');
        return;
      }

      try {
        // Get patient details
        const resp1 = await fetch('https://localhost:7130/api/PatientRegistration', {
          headers: { 
            'Authorization': `Bearer ${token}`, 
            'Accept': 'application/json' 
          }
        });
        if (!resp1.ok) throw new Error('Failed to fetch patient details');
        const patients = await resp1.json();
        const me = patients.find(p => p.email.toLowerCase() === userEmail.toLowerCase());
        if (!me) throw new Error('Patient account not found');

        setPatientData(me);
        setAppointmentData(ad => ({
          ...ad,
          patientId: me.patientId
        }));

        // Get doctor list
        const resp2 = await fetch('https://localhost:7130/api/DoctorRegistration', {
          headers: { 
            'Authorization': `Bearer ${token}`, 
            'Accept': 'application/json' 
          }
        });
        if (!resp2.ok) throw new Error('Failed to fetch doctors');
        setDoctors(await resp2.json());
      }
      catch (err) {
        setError(err.message); // Always set as string
        localStorage.clear();
        navigate('/login');
      }
      finally {
        setLoading(false);
      }
    }
    fetchInitialData();
  }, [navigate]);

  // Book appointment handler
  const handleBookAppointment = async e => {
    e.preventDefault();
    setError(""); 
    const token = localStorage.getItem('token');
    if (!appointmentData.doctorId || !appointmentData.appointmentDate || !appointmentData.appointmentTime) {
      toast.error('Please select date, doctor and time.');
      return;
    }
    try {
      const formattedDate = new Date(appointmentData.appointmentDate)
        .toISOString().split('T')[0];
      const formattedTime = `${appointmentData.appointmentTime}:00`;

      const body = {
        doctorId: +appointmentData.doctorId,
        patientId: +appointmentData.patientId,
        appointmentDate: formattedDate,
        appointmentTime: formattedTime,
        status: 'Scheduled'
      };

      const res = await fetch('https://localhost:7130/api/Appointments/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || res.statusText);
      }

      toast.success('Appointment booked successfully');
      setAppointmentData(ad => ({
        ...ad,
        doctorId: '',
        appointmentDate: '',
        appointmentTime: ''
      }));
      setActiveSection('myAppointments');
    }
    catch (err) {
      setError(err.message); // Always set as string
      toast.error(`Booking failed: ${err.message}`);
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
            handleBookAppointment={handleBookAppointment}
            doctors={doctors}
          />
        );
      case 'myAppointments':
        return <MyAppointments patientId={patientData.patientId} />;
      case 'medicalHistory':
        return <MedicalHistory patientId={patientData.patientId} />;
      case 'notifications':
        return <Notifications patientId={patientData.patientId} />;
      case 'profile':
        return <Profile patientData={patientData} />;
      default:
        return null;
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error)   return <Error message={error} />;

  return (
    <div className="patient-dashboard">
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        handleLogout={handleLogout}
        patientName={patientData && patientData.name}
      />

      <div className="main-content-wrapper">
        <div className="marquee-container">
          <div className="marquee-text">
            Welcome to Cognizant Healthcare{patientData && `, ${patientData.name}`}!
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