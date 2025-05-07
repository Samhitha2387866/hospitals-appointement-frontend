import React, { useState, useEffect } from 'react';
import './MedicalHistory.css';

function MedicalHistory({ patientId }) {
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [doctorDetails, setDoctorDetails] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch medical history
  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        const response = await fetch(`https://localhost:7130/api/MedicalHistory/ByPatient/${patientId}`);
        
        if (!response.ok) {
          setMedicalHistory([]);
          setLoading(false);
          return;
        }
        
        const data = await response.json();
        if (Array.isArray(data)) {
          // Sort so that the most recent (by visitDate, then id) are first
          data.sort((a, b) => {
            const dateDiff = new Date(b.visitDate) - new Date(a.visitDate);
            if (dateDiff !== 0) return dateDiff;
            return (b.id || 0) - (a.id || 0);
          });
          setMedicalHistory(data);
        } else {
          setMedicalHistory([]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setMedicalHistory([]);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchMedicalHistory();
    } else {
      setLoading(false);
    }
  }, [patientId]);

  // Fetch doctor details (name and specialization) for unique doctorIds
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      const uniqueDoctorIds = [
        ...new Set(medicalHistory.map((item) => item.doctorId)),
      ].filter(Boolean);

      const newDoctorDetails = {};

      await Promise.all(
        uniqueDoctorIds.map(async (doctorId) => {
          try {
            const res = await fetch(
              `https://localhost:7130/api/DoctorRegistration/${doctorId}`
            );
            if (res.ok) {
              const docData = await res.json();
              newDoctorDetails[doctorId] = {
                doctorName: docData.doctorName || `Dr. ${doctorId}`,
                specialization: docData.specialization || 'N/A',
              };
            } else {
              newDoctorDetails[doctorId] = {
                doctorName: `Dr. ${doctorId}`,
                specialization: 'N/A',
              };
            }
          } catch {
            newDoctorDetails[doctorId] = {
              doctorName: `Dr. ${doctorId}`,
              specialization: 'N/A',
            };
          }
        })
      );
      setDoctorDetails((prevDetails) => ({ ...prevDetails, ...newDoctorDetails }));
    };

    if (medicalHistory.length > 0) {
      fetchDoctorDetails();
    }
  }, [medicalHistory]);

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

  return (
    <div className="medical-history">
      <h2>Medical History</h2>
      {medicalHistory.length > 0 ? (
        <ul className="history-list">
          {medicalHistory.map((item) => (
            <li key={item.id} className="history-item">
              <div className="history-card">
                <p>
                  <strong>Doctor Name:</strong>{' '}
                  {doctorDetails[item.doctorId]?.doctorName || `Dr. ${item.doctorId}`}
                </p>
                <p>
                  <strong>Specialization:</strong>{' '}
                  {doctorDetails[item.doctorId]?.specialization || 'N/A'}
                </p>
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