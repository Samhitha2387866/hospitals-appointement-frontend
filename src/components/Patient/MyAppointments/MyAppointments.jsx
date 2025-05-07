import React, { useState, useEffect } from 'react';
import './MyAppointments.css';
import { toast } from 'react-toastify';

function MyAppointments({ patientId }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `https://localhost:7130/api/Appointments/ByPatient/${patientId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error('No appointments');
        setAppointments(await res.json());
      }
      catch (err) {
        console.error(err);
        setError(err.message);
      }
      finally {
        setLoading(false);
      }
    }
    load();
  }, [patientId, token]);

  const handleCancel = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      const res = await fetch(`https://localhost:7130/api/Appointments/ByPatient/${patientId}/${appointmentId}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
      })
      if (res.status !== 204) throw new Error('Cancellation failed');
      toast.success('Appointment cancelled');
      setAppointments(appts => appts.filter(a => a.appointmentId !== appointmentId));
    } catch (err) {
      toast.error('Failed to cancel appointment');
    }
  };

  // Compute upcoming appointments only (current date/time or later)
  const now = new Date();
  const upcomingAppointments = appointments.filter(a => {
    if (!a.appointmentDate || !a.appointmentTime) return false;
    const appointmentDateTime = new Date(
      a.appointmentDate + 'T' + (
        a.appointmentTime.length === 5
        ? a.appointmentTime + ":00"
        : a.appointmentTime
      )
    );
    return appointmentDateTime >= now;
  });

  if (loading) return <div className="loader">Loading appointments…</div>;
  if (error)   return <div className="error">{error}</div>;
  if (upcomingAppointments.length === 0)
    return <div className="no-appointments">You have no upcoming appointments.</div>;

  return (
    <div className="content-card">
      <h3>My Appointments</h3>
      <table className="appointments-table">
        <thead>
          <tr>
            <th>Doctor</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {upcomingAppointments.map(a => (
            <tr key={a.appointmentId}>
              <td>
                Dr. {a.doctorName || 'Unknown'}
                {a.specialization ? ` (${a.specialization})` : ''}
              </td>
              <td>{a.appointmentDate ? new Date(a.appointmentDate).toLocaleDateString() : ''}</td>
              <td>{a.appointmentTime ? a.appointmentTime.slice(0,5) : ''}</td>
              <td>{a.status}</td>
              <td>
                <button
                  className="cancel-btn"
                  onClick={() => handleCancel(a.appointmentId)}
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MyAppointments;