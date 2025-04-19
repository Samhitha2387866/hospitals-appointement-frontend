// src/components/patient/Notifications/Notifications.jsx
import React, { useState, useEffect } from 'react';
import './Notifications.css';

function Notifications({ patientId }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`https://localhost:7130/api/Notifications/patient/${patientId}`);
        if (!response.ok) throw new Error('Failed to fetch notifications');
        const data = await response.json();
        console.log('Fetched data:', data);
        setNotifications(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [patientId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? 'Invalid Date' : date.toLocaleDateString();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="notifications">
      <h2>Notifications</h2>
      <ul>
        {notifications.length > 0 ? (
          notifications.map((item) => (
            <li key={item.notificationId}>
              <p>Appointment ID: {item.appointmentId}</p>
              <p>Doctor ID: {item.doctorId}</p>
              <p>Appointment Date: {formatDate(item.appointmentDate)}</p>
              <p>Appointment Time: {item.appointmentTime}</p>
            </li>
          ))
        ) : (
          <p>No notifications available.</p>
        )}
      </ul>
    </div>
  );
}

export default Notifications;