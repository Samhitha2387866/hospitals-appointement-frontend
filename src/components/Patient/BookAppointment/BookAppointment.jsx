import React from 'react';
import './BookAppointment.css';

function BookAppointment({ appointmentData, setAppointmentData, doctors, handleBookAppointment }) {
  return (
    <div className="content-card">
      <h3>Book New Appointment</h3>
      <form onSubmit={handleBookAppointment}>
        <div className="form-group">
          <label>Patient ID:</label>
          <input
            type="number"
            value={appointmentData.patientId}
            readOnly
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Doctor ID:</label>
          <input
            type="number"
            value={appointmentData.doctorId}
            onChange={(e) => setAppointmentData({
              ...appointmentData,
              doctorId: e.target.value
            })}
            required
            className="form-control"
            placeholder="Enter Doctor ID"
          />
        </div>

        <div className="form-group">
          <label>Available Doctors</label>
          <table className="doctors-table">
            <thead>
              <tr>
                <th>Doctor ID</th>
                <th>Name</th>
                <th>Specialization</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.doctorId}>
                  <td>{doctor.doctorId}</td>
                  <td>Dr. {doctor.doctorName}</td>
                  <td>{doctor.specialization}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="form-group">
          <label>Appointment Date:</label>
          <input
            type="date"
            value={appointmentData.appointmentDate}
            onChange={(e) => setAppointmentData({
              ...appointmentData,
              appointmentDate: e.target.value
            })}
            min={new Date().toISOString().split('T')[0]}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Appointment Time:</label>
          <input
            type="time"
            value={appointmentData.appointmentTime}
            onChange={(e) => setAppointmentData({
              ...appointmentData,
              appointmentTime: e.target.value
            })}
            required
            className="form-control"
          />
        </div>

        <button 
          type="submit" 
          className="book-button"
          disabled={!appointmentData.doctorId || !appointmentData.appointmentDate || !appointmentData.appointmentTime}
        >
          Book Appointment
        </button>
      </form>
    </div>
  );
}

export default BookAppointment;