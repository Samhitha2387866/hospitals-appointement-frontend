import React, { useEffect, useState } from 'react';
import './DoctorProfile.css';
import { useParams, useNavigate } from 'react-router-dom';

function DoctorProfile() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    contactNumber: '',
    email: '',
  });

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`https://localhost:7130/api/DoctorRegistration/${doctorId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDoctor(data);
          setFormData({
            contactNumber: data.contactNumber,
            email: data.email,
          });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://localhost:7130/api/DoctorRegistration/${doctorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...doctor,
          contactNumber: formData.contactNumber,
          email: formData.email,
        }),
      });

      if (!response.ok) throw new Error('Failed to update doctor profile');
      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        navigate('/doctor-dashboard');
      }, 1500); // Wait 1.5 seconds before navigating
    } catch (error) {
      setError(error.message);
      setSuccess('');
      console.error('Error updating profile:', error);
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="profile-container">
      <h2>Edit Doctor Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="profile-details">
          <label>
            <strong>Doctor Id:</strong>
            <input type="text" value={doctor.doctorId} disabled />
          </label>
          <label>
            <strong>Name:</strong>
            <input type="text" value={doctor.doctorName} disabled />
          </label>
          <label>
            <strong>Specialization:</strong>
            <input type="text" value={doctor.specialization} disabled />
          </label>
          <label>
            <strong>Gender:</strong>
            <input type="text" value={doctor.gender} disabled />
          </label>
          <label>
            <strong>Contact Number:</strong>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
            />
          </label>
          <label>
            <strong>Email:</strong>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
        </div>
        <button type="submit">Save Changes</button>
      </form>
      {success && <div className="success-message">{success}</div>}
    </div>
  );
}

export default DoctorProfile;