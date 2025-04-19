import React, { useEffect, useState } from 'react';
import './ScheduledAppointments.css';

function ScheduledAppointments({ doctorId }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          setAppointments(data);
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