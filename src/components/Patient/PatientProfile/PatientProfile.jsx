import React from 'react';
import './PatientProfile.css';

function Profile({ patientData }) {
  return (
    <div className="content-card">
      <h3>Patient Profile</h3>
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {patientData?.patientName?.charAt(0)}
          </div>
          <h2>{patientData?.patientName}</h2>
        </div>
        <div className="profile-details-grid">
          <div className="detail-box">
            <div className="detail-label">Patient ID</div>
            <div className="detail-value">{patientData?.patientId}</div>
          </div>
          <div className="detail-box">
            <div className="detail-label">Name</div>
            <div className="detail-value">{patientData?.patientName}</div>
          </div>
          <div className="detail-box">
            <div className="detail-label">Email</div>
            <div className="detail-value">{patientData?.email}</div>
          </div>
          <div className="detail-box">
            <div className="detail-label">Contact Number</div>
            <div className="detail-value">{patientData?.contactNumber}</div>
          </div>
          <div className="detail-box">
            <div className="detail-label">Gender</div>
            <div className="detail-value">{patientData?.gender}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;