import React, { useState } from 'react';
import './TimeSlots.css';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

function AddTimeSlots({ doctorId }) {
  const [availabilityData, setAvailabilityData] = useState({
    availableDate: '',
    startTime: '',
    endTime: '',
  });
  const [error, setError] = useState('');

  const handleAddTimeSlot = async (e) => {
    e.preventDefault();
  
    setError('');
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
        toast.success('Time slot added successfully!');
        setAvailabilityData({
          availableDate: '',
          startTime: '',
          endTime: '',
        });
      } else {
        setError('Failed to add time slot');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to add time slot');
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
            min={new Date().toISOString().split('T')[0]}
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
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default AddTimeSlots;