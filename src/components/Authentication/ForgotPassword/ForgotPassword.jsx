import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [patientId, setPatientId] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const navigate = useNavigate();

  const handleEmailVerification = async () => {
    setIsLoading(true);
    try {
      const verifyResponse = await fetch(`https://localhost:7130/api/PatientRegistration`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!verifyResponse.ok) {
        throw new Error("Failed to fetch patient data");
      }

      const patients = await verifyResponse.json();
      const patient = patients.find(p => p.email.toLowerCase() === email.toLowerCase());

      if (!patient) {
        toast.error("No patient found with this email");
        setIsLoading(false);
        return;
      }

      // Store full patient data
      setPatientData(patient);
      setPatientId(patient.patientId);
      toast.success("Email verified. You can now reset your password.");
    } catch (error) {
      console.error("Email verification error:", error);
      toast.error(error.message || "An error occurred while verifying email");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    // Validate password match
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      toast.error("Password must be at least 8 characters long and include a letter, number, and special character");
      return;
    }

    // Ensure patient data is available
    if (!patientData) {
      toast.error("Please verify your email first");
      return;
    }

    setIsLoading(true);

    try {
      // Prepare updated patient object
      const updatedPatient = {
        ...patientData,
        passwordHash: newPassword // Note: using passwordHash instead of password
      };

      // Remove any read-only or complex properties that might cause issues
      delete updatedPatient.medicalHistories;
      delete updatedPatient.appointments;

      // Debug: Log the payload
      console.log("Payload for update:", JSON.stringify(updatedPatient));

      // Update password
      const updateResponse = await fetch(`https://localhost:7130/api/PatientRegistration/${patientId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(updatedPatient)
      });

      // Debug: Log the full response
      const responseText = await updateResponse.text();
      console.log("Response status:", updateResponse.status);
      console.log("Response body:", responseText);

      if (!updateResponse.ok) {
        throw new Error(responseText || "Failed to update password");
      }

      toast.success("Password updated successfully");
      navigate("/login");
    } catch (error) {
      console.error("Full Password Reset Error:", {
        message: error.message,
        patientId: patientId,
        patientData: patientData
      });
      
      // More detailed error toast
      toast.error(`Password Reset Failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2>Reset Password</h2>
        <form onSubmit={handlePasswordReset}>
          <div className="input-group">
            <label>Email</label>
            <div className="email-verification">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={patientId !== null || isLoading}
                required
                placeholder="Enter your registered email"
              />
              {!patientId && (
                <button 
                  type="button" 
                  className="verify-email-button"
                  onClick={handleEmailVerification}
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify"}
                </button>
              )}
            </div>
          </div>

          {patientId && (
            <>
              <div className="input-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  placeholder="Enter new password"
                />
              </div>
              <div className="input-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  placeholder="Confirm new password"
                />
              </div>
              <button
                type="submit"
                className="reset-password-button"
                disabled={isLoading}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;