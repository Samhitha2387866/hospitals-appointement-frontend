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
        if (!response.ok) throw new Error('Failed to fetch medical history');
        const data = await response.json();
        console.log('Fetched data:', data);
        setMedicalHistory(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicalHistory();
  }, [patientId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? 'Invalid Date' : date.toLocaleDateString();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="medical-history">
      <h2>Medical History</h2>
      <ul>
        {medicalHistory.length > 0 ? (
          medicalHistory.map((item) => (
            <li key={item.id}>
              <p>Patient Name: {item.patientName}</p>
              <p>Doctor ID: {item.doctorId}</p>
              <p>Visit Date: {formatDate(item.visitDate)}</p>
              <p>Treatment: {item.treatment}</p>
              <p>Medicines Prescribed: {item.medicines_prescribed}</p>
            </li>
          ))
        ) : (
          <p>No medical history available.</p>
        )}
      </ul>
    </div>
  );
}

export default MedicalHistory;