import React, { useState } from 'react';
import './TimeSlots.css';

function AddTimeSlots({ doctorId }) {
  const [availabilityData, setAvailabilityData] = useState({
    availableDate: '',
    startTime: '',
    endTime: '',
  });

  const handleAddTimeSlot = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('https://localhost:7130/api/DoctorAvailability/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorId: doctorId,
          availableDate: availabilityData.availableDate,
          startTime: `${availabilityData.startTime}:00`,
          endTime: `${availabilityData.endTime}:00`,
        }),
      });

      if (response.ok) {
        alert('Time slot added successfully');
        setAvailabilityData({
          availableDate: '',
          startTime: '',
          endTime: '',
        });
      } else {
        alert('Failed to add time slot');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add time slot');
    }
  };

  return (
    <div className="content-card">
      <h3>Add New Time Slot</h3>
      <form onSubmit={handleAddTimeSlot}>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={availabilityData.availableDate}
            onChange={(e) => setAvailabilityData({
              ...availabilityData,
              availableDate: e.target.value
            })}
            required
          />
        </div>
        <div className="form-group">
          <label>Start Time:</label>
          <input
            type="time"
            value={availabilityData.startTime}
            onChange={(e) => setAvailabilityData({
              ...availabilityData,
              startTime: e.target.value
            })}
            required
          />
        </div>
        <div className="form-group">
          <label>End Time:</label>
          <input
            type="time"
            value={availabilityData.endTime}
            onChange={(e) => setAvailabilityData({
              ...availabilityData,
              endTime: e.target.value
            })}
            required
          />
        </div>
        <button type="submit" className="submit-button">Add Time Slot</button>
      </form>
    </div>
  );
}

export default AddTimeSlots;