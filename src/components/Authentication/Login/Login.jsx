import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [userType, setUserType] = useState("patient");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // First, authenticate the user
      const loginResponse = await fetch("https://localhost:7130/api/Authentication/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.message || "Login failed");
      }

      // Display the token in the console
      console.log("Token:", loginData.token);

      // After successful authentication, verify user type
      const verifyUserType = await fetch(
        `https://localhost:7130/api/${userType === 'patient' ? 'PatientRegistration' : 'DoctorRegistration'}`,
        {
          headers: {
            'Authorization': `Bearer ${loginData.token}`,
            'Accept': 'application/json'
          }
        }
      );
      if (!verifyUserType.ok) {
        const errorData = await verifyUserType.json();
        throw new Error(errorData.message || `Failed to verify ${userType} account`);
      }
      const userData = await verifyUserType.json();
      const user = userData.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        throw new Error(`No ${userType} account found with this email`);
      }

      localStorage.setItem("token", loginData.token);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userType", userType);

      navigate(`/${userType}-dashboard`);
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>User Type</label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              disabled={isLoading}
            >
              <option value="doctor">Login as a Doctor</option>
              <option value="patient">Login as a Patient</option>
            </select>
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        {/* Only show Forgot Password for patient */}
        {userType === "patient" && (
          <p className="forgot-password-link">
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>
        )}
        {userType === "patient" && (
          <p className="sign-up">
            Don't have an account? <Link to="/signUp" className="link">Sign Up</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;