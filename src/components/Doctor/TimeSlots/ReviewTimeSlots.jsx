import React, { useEffect, useState } from 'react';
import './TimeSlots.css';

function ReviewTimeSlots({ doctorId }) {
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`https://localhost:7130/api/DoctorAvailability/${doctorId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setTimeSlots(data);
        } else {
          throw new Error('Failed to fetch time slots');
        }
      } catch (error) {
        setError(error.message);
        console.error('Error fetching time slots:', error);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchTimeSlots();
    }
  }, [doctorId]);

  if (loading) return <div className="loading">Loading time slots...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="time-slots-section">
      <h4>Available Time Slots</h4>
      {timeSlots.length > 0 ? (
        <div className="time-slots-grid">
          {timeSlots.map((slot) => (
            <div key={slot.availabilityId} className="time-slot-card">
              <div className="slot-date">
                {new Date(slot.availableDate).toLocaleDateString()}
              </div>
              <div className="slot-time">
                <span>{slot.startTime.substring(0, 5)}</span>
                <span> to </span>
                <span>{slot.endTime.substring(0, 5)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No time slots available</p>
      )}
    </div>
  );
}

export default ReviewTimeSlots;