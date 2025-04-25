import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './AddMedicalHistory.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddMedicalHistory() {
  const location = useLocation();
  const navigate = useNavigate();
  const { patientId, patientName, doctorId, appointmentDate } = location.state;

  const [formData, setFormData] = useState({
    treatment: '',
    medicines_prescribed: '',
    visitDate: new Date(appointmentDate).toISOString().split('T')[0]
  });

  const [status, setStatus] = useState({
    message: '',
    type: '' // 'success' or 'error'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ message: '', type: '' });

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://localhost:7130/api/MedicalHistory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          patientId: patientId,
          patientName: patientName,
          doctorId: doctorId,
          visitDate: formData.visitDate,
          treatment: formData.treatment,
          medicines_prescribed: formData.medicines_prescribed
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add medical history');
      }

      // setStatus({
      //   message: 'Medical history added successfully!',
      //   type: 'success'
      // });
      toast.success('Medical history added successfully!');

      // Redirect immediately after success
      navigate(-1);

    } catch (err) {
      setStatus({
        message: 'Failed to add medical history. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-medical-history-container">
      <h2>Add Medical History</h2>
      <form onSubmit={handleSubmit} className="medical-history-form">
        <div className="form-group">
          <label>Patient Name:</label>
          <input type="text" value={patientName} disabled />
        </div>

        <div className="form-group">
          <label>Visit Date:</label>
          <input
            type="date"
            name="visitDate"
            value={formData.visitDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Treatment:</label>
          <textarea
            name="treatment"
            value={formData.treatment}
            onChange={handleChange}
            required
            maxLength={500}
          />
        </div>

        <div className="form-group">
          <label>Medicines Prescribed:</label>
          <textarea
            name="medicines_prescribed"
            value={formData.medicines_prescribed}
            onChange={handleChange}
            maxLength={500}
          />
        </div>
      
        <div className="button-group">
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Medical History'}
          </button>
          <button type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>

        {status.message && (
          <div className={`status-message ${status.type}`}>
            {status.message}
          </div>
        )}
      </form>
    </div>
  );
}

export default AddMedicalHistory;