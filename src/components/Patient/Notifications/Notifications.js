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

        if (response.status === 404) {
          setNotifications([]);
          return;
        }

        if (!response.ok) {
          throw new Error('An error occurred while fetching notifications');
        }

        const data = await response.json();
        setNotifications(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchNotifications();
    } else {
      setLoading(false);
      setError('Invalid patient ID');
    }
  }, [patientId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? 'Invalid Date' : date.toLocaleDateString();
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Not specified';
    return timeString.substring(0, 5); // Format as HH:mm
  };

  // Sort notifications by appointmentId in descending order
  const sortedNotifications = [...notifications].sort((a, b) => b.appointmentId - a.appointmentId);

  if (loading) {
    return (
      <div className="notifications">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notifications">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications">
      <h2>Notifications</h2>
      {sortedNotifications.length > 0 ? (
        <ul className="notifications-list">
          {sortedNotifications.map((item) => (
            <li key={item.notificationId} className="notification-item">
              <div className="notification-card">
                {item.customMessage ? (
                  <p style={{ fontWeight: "bold", color: "#d35400" }}>{item.customMessage}</p>
                ) : (
                  <>
                    <p><strong>Appointment Date:</strong> {formatDate(item.appointmentDate)}</p>
                    <p><strong>Appointment Time:</strong> {formatTime(item.appointmentTime)}</p>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="no-notifications-message">
          <p>No notifications available at this time.</p>
        </div>
      )}
    </div>
  );
}

export default Notifications;