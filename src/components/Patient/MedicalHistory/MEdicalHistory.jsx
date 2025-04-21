// src/components/patient/MedicalHistory/MedicalHistory.jsx
import React, { useState, useEffect } from 'react';
import './MedicalHistory.css';

function MedicalHistory({ patientId }) {
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        const response = await fetch(`https://localhost:7130/api/MedicalHistory/ByPatient/${patientId}`);
        
        if (response.status === 404) {
          setMedicalHistory([]);
          return;
        }

        if (!response.ok) {
          throw new Error('An error occurred while fetching medical history');
        }

        const data = await response.json();
        console.log('Fetched data:', data);
        setMedicalHistory(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchMedicalHistory();
    } else {
      setLoading(false);
      setError('Invalid patient ID');
    }
  }, [patientId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? 'Invalid Date' : date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="medical-history">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="medical-history">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="medical-history">
      <h2>Medical History</h2>
      {medicalHistory.length > 0 ? (
        <ul className="history-list">
          {medicalHistory.map((item) => (
            <li key={item.id} className="history-item">
              <div className="history-card">
                <p><strong>Patient Name:</strong> {item.patientName}</p>
                <p><strong>Doctor ID:</strong> {item.doctorId}</p>
                <p><strong>Visit Date:</strong> {formatDate(item.visitDate)}</p>
                <p><strong>Treatment:</strong> {item.treatment}</p>
                <p><strong>Medicines Prescribed:</strong> {item.medicines_prescribed}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="no-history-message">
          <p>No medical history available for this patient.</p>
        </div>
      )}
    </div>
  );
}

export default MedicalHistory;