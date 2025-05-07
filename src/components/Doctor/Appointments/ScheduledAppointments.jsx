import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ScheduledAppointments.css';
 
function ScheduledAppointments({ doctorId }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(
          `https://localhost:7130/api/Appointments/view/byDoctor/${doctorId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
 
        if (response.ok) {
          const data = await response.json();
          // Filter appointments from today onwards
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const filteredAppointments = data.filter(app => {
            const appDate = new Date(app.appointmentDate);
            appDate.setHours(0, 0, 0, 0);
            return appDate >= today;
          });
          setAppointments(filteredAppointments);
        } else {
          throw new Error('Failed to fetch appointments');
        }
      } catch (error) {
        setError(error.message);
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };
 
    if (doctorId) {
      fetchAppointments();
    }
  }, [doctorId]);
 
  const handleAddMedicalHistory = (appointment) => {
    navigate('/doctor-dashboard/add-medical-history', {
      state: {
        patientId: appointment.patientId,
        patientName: appointment.patientName,
        doctorId: doctorId,
        appointmentDate: appointment.appointmentDate
      }
    });
  };
 
  // Helper function to check if appointment is done (in the past)
  function isAppointmentDone(appointment) {
    // Combine date and time into a single Date object
    const [hours, minutes] = appointment.appointmentTime.split(':');
    const appDate = new Date(appointment.appointmentDate);
    appDate.setHours(Number(hours), Number(minutes), 0, 0);
    const now = new Date();
    return appDate <= now;
  }
 
  if (loading) return <div className="loading">Loading appointments...</div>;
  if (error) return <div className="error">{error}</div>;
 
  return (
    <div className="appointments-section">
      <h4>Your Appointments</h4>
      {appointments.length > 0 ? (
        <ul className="appointments-list">
          {appointments.map((appointment) => (
            <li key={appointment.appointmentId} className="appointment-item">
              <div className="appointment-detail">
                <span className="label">Patient:</span>
                <span className="value">{appointment.patientName}</span>
              </div>
              <div className="appointment-detail">
                <span className="label">Date:</span>
                <span className="value">
                  {new Date(appointment.appointmentDate).toLocaleDateString()}
                </span>
              </div>
              <div className="appointment-detail">
                <span className="label">Time:</span>
                <span className="value">{appointment.appointmentTime}</span>
              </div>
              <button
                className="add-medical-history-btn"
                onClick={() => handleAddMedicalHistory(appointment)}
                disabled={!isAppointmentDone(appointment)}
                title={
                  !isAppointmentDone(appointment)
                    ? "You can add medical history only after the appointment is done."
                    : ""
                }
              >
                Add Medical History
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No appointments scheduled</p>
      )}
    </div>
  );
}
 
export default ScheduledAppointments;
 