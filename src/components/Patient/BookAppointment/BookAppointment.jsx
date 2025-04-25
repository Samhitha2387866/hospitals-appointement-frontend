import React, { useState, useEffect } from 'react';
import './BookAppointment.css';

function BookAppointment({ appointmentData, setAppointmentData, handleBookAppointment }) {
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Fetch doctors when date changes
  useEffect(() => {
    if (appointmentData.appointmentDate) {
      setLoadingDoctors(true);
      setDoctors([]);
      setSelectedDoctor(null);
      setAppointmentData({ ...appointmentData, doctorId: '', appointmentTime: '' });
      fetch(`https://localhost:7130/api/DoctorAvailability/doctor-details/${formatDate(appointmentData.appointmentDate)}`)
        .then(res => res.ok ? res.json() : [])
        .then(data => setDoctors(data))
        .catch(() => setDoctors([]))
        .finally(() => setLoadingDoctors(false));
    }
    // eslint-disable-next-line
  }, [appointmentData.appointmentDate]);

  // Fetch slots when doctor changes
  useEffect(() => {
    if (appointmentData.doctorId && appointmentData.appointmentDate) {
      setLoadingSlots(true);
      setSlots([]);
      fetch(`https://localhost:7130/api/DoctorAvailability/available-slots/${appointmentData.doctorId}/${formatDate(appointmentData.appointmentDate)}`)
        .then(res => res.ok ? res.json() : [])
        .then(data => setSlots(Array.isArray(data) ? data : []))
        .catch(() => setSlots([]))
        .finally(() => setLoadingSlots(false));
    }
    // eslint-disable-next-line
  }, [appointmentData.doctorId, appointmentData.appointmentDate]);

  function formatDate(dateStr) {
    // Converts yyyy-mm-dd to dd-MM-yyyy
    const [yyyy, mm, dd] = dateStr.split('-');
    return `${dd}-${mm}-${yyyy}`;
  }

  function handleDoctorSelect(doctor) {
    setSelectedDoctor(doctor);
    setAppointmentData({
      ...appointmentData,
      doctorId: doctor.doctorId,
      appointmentTime: ''
    });
  }

  function handleSlotSelect(slot) {
    setAppointmentData({
      ...appointmentData,
      appointmentTime: slot.startTime
    });
  }

  // Filter slots: for today, only show slots at least 30 minutes from now
  function filterSlots(slots) {
    const todayStr = new Date().toISOString().split('T')[0];
    if (appointmentData.appointmentDate !== todayStr) return slots;

    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // 30 minutes from now

    return slots.filter(slot => {
      // slot.startTime is in "HH:mm" format
      const [slotHour, slotMinute] = slot.startTime.split(':').map(Number);
      const slotDate = new Date(appointmentData.appointmentDate);
      slotDate.setHours(slotHour, slotMinute, 0, 0);
      return slotDate >= now;
    });
  }

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

        {appointmentData.appointmentDate && (
          <div className="form-group">
            <label>Available Doctors</label>
            {loadingDoctors ? (
              <div>Loading doctors...</div>
            ) : doctors.length === 0 ? (
              <div>No doctors available on this date.</div>
            ) : (
              <table className="doctors-table">
                <thead>
                  <tr>
                    <th>Doctor ID</th>
                    <th>Name</th>
                    <th>Specialization</th>
                    <th>Select</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doctor) => (
                    <tr key={doctor.doctorId} className={selectedDoctor && selectedDoctor.doctorId === doctor.doctorId ? 'selected-row' : ''}>
                      <td>{doctor.doctorId}</td>
                      <td>Dr. {doctor.doctorName}</td>
                      <td>{doctor.specialization}</td>
                      <td>
                        <button
                          type="button"
                          className="select-doctor-btn"
                          onClick={() => handleDoctorSelect(doctor)}
                          disabled={selectedDoctor && selectedDoctor.doctorId === doctor.doctorId}
                        >
                          {selectedDoctor && selectedDoctor.doctorId === doctor.doctorId ? 'Selected' : 'Select'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {appointmentData.doctorId && (
          <div className="form-group">
            <label>Available Time Slots</label>
            {loadingSlots ? (
              <div>Loading slots...</div>
            ) : filterSlots(slots).length === 0 ? (
              <div>No available slots for this doctor on the selected date.</div>
            ) : (
              <div className="slots-container">
                {filterSlots(slots).map((slot, idx) => (
                  <button
                    type="button"
                    key={idx}
                    className={`slot-btn${appointmentData.appointmentTime === slot.startTime ? ' selected-slot' : ''}`}
                    onClick={() => handleSlotSelect(slot)}
                  >
                    {slot.startTime} - {slot.endTime}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          className="book-button"
          disabled={
            !appointmentData.doctorId ||
            !appointmentData.appointmentDate ||
            !appointmentData.appointmentTime
          }
        >
          Book Appointment
        </button>
      </form>
    </div>
  );
}

export default BookAppointment;