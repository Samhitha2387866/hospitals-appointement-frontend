import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      const response = await fetch("https://localhost:7130/api/Authentication/login", {
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

      const data = await response.json();
      console.log('Login response:', data); // Debugging line

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (!data.token) {
        throw new Error("Token not received from server");
      }

      localStorage.setItem("token", data.token);
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
        {userType === "patient" && (
          <>
            <p className="forgot-password">
              <a href="/forgot-password">Forgot Password?</a>
            </p>
            <p className="sign-up">
              Don't have an account? <a href="/sign-up">Sign Up</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;