import React, { useEffect, useState } from 'react';
import './DoctorProfile.css';
import { useParams } from 'react-router-dom';

function DoctorProfile() {
  const { doctorId } = useParams(); // Get doctorId from URL parameters
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`https://localhost:7130/api/DoctorRegistration/${doctorId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setDoctor(data);
        } else {
          throw new Error('Failed to fetch doctor profile');
        }
      } catch (error) {
        setError(error.message);
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchDoctorProfile();
    }
  }, [doctorId]);

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="profile-container">
      <h2>Doctor Profile</h2>
      <div className="profile-details">
        <p><strong>Doctor Id: </strong>{doctor.doctorId}</p>
        <p><strong>Name:</strong> {doctor.doctorName}</p>
        <p><strong>Specialization:</strong> {doctor.specialization}</p>
        <p><strong>Contact Number:</strong> {doctor.contactNumber}</p>
        <p><strong>Email:</strong> {doctor.email}</p>
        <p><strong>Gender:</strong> {doctor.gender}</p>
      </div>
    </div>
  );
}

export default DoctorProfile;