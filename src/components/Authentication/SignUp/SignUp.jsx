import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    patientName: "",
    dateOfBirth: "",
    contactNumber: "",
    emergencyContact: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Comprehensive Validation Functions
  const validations = {
    patientName: (value) => {
      if (!value.trim()) return "Patient Name is required";
      if (value.trim().length < 2) return "Name must be at least 2 characters";
      if (value.trim().length > 100) return "Name cannot exceed 100 characters";
      if (!/^[A-Za-z\s]+$/.test(value)) return "Name can only contain letters";
      return "";
    },

    dateOfBirth: (value) => {
      if (!value) return "Date of Birth is required";
      
      const selectedDate = new Date(value);
      const currentDate = new Date();
      const minAge = new Date();
      minAge.setFullYear(currentDate.getFullYear() - 120);
      const maxAge = new Date();
      maxAge.setFullYear(currentDate.getFullYear() - 0);

      if (selectedDate > maxAge) return "Date of Birth cannot be in the future";
      if (selectedDate < minAge) return "Invalid Date of Birth";
      
      // Calculate age
      const age = currentDate.getFullYear() - selectedDate.getFullYear();
      if (age < 0 || age > 120) return "Invalid Date of Birth";
      
      return "";
    },

    contactNumber: (value) => {
      if (!value) return "Contact Number is required";
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(value)) return "Invalid mobile number";
      return "";
    },

    emergencyContact: (value) => {
      if (!value) return "Emergency Contact is required";
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(value)) return "Invalid emergency contact number";
      return "";
    },

    gender: (value) => {
      if (!value) return "Gender is required";
      const validGenders = ["male", "female", "other"];
      if (!validGenders.includes(value.toLowerCase())) return "Invalid gender selection";
      return "";
    },

    email: (value) => {
      if (!value) return "Email is required";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Invalid email address";
      if (value.length > 100) return "Email cannot exceed 100 characters";
      return "";
    },

    password: (value) => {
      if (!value) return "Password is required";
      if (value.length < 8) return "Password must be at least 8 characters";
      if (value.length > 100) return "Password cannot exceed 100 characters";
      
      // Password strength criteria
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumbers = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

      if (!hasUpperCase) return "Password must contain at least one uppercase letter";
      if (!hasLowerCase) return "Password must contain at least one lowercase letter";
      if (!hasNumbers) return "Password must contain at least one number";
      if (!hasSpecialChar) return "Password must contain at least one special character";

      return "";
    },

    confirmPassword: (value) => {
      if (!value) return "Please confirm your password";
      if (value !== formData.password) return "Passwords do not match";
      return "";
    }
  };

  // Handle input changes with real-time validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Validate the specific field
    const error = validations[name](value);
    
    // Update errors
    setErrors(prevState => ({
      ...prevState,
      [name]: error
    }));
  };

  // Comprehensive form validation
  const validateForm = () => {
    const newErrors = {};

    // Validate each field
    Object.keys(formData).forEach(key => {
      const error = validations[key](formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate entire form
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Prepare registration data
      const registrationData = {
        patientName: formData.patientName.trim(),
        dateOfBirth: formData.dateOfBirth,
        contactNumber: formData.contactNumber,
        emergencyContact: formData.emergencyContact,
        gender: formData.gender,
        email: formData.email.toLowerCase(),
        passwordHash: formData.password,
        role: "patient"
      };

      try {
        // Log request details for debugging
        console.log('Registration Request:', registrationData);

        const response = await fetch('https://localhost:7130/api/PatientRegistration', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registrationData)
        });

        // Handle response
        const responseText = await response.text();
        console.log('Raw Response:', responseText);

        if (!response.ok) {
          // Parse error response
          let errorData;
          try {
            errorData = JSON.parse(responseText);
          } catch {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          // Throw specific error
          throw new Error(errorData.message || 'Registration failed');
        }

        // Success handling
        alert("Registration Successful!");
        navigate("/login");

      } catch (error) {
        // Comprehensive error logging
        console.error("Registration Error:", {
          message: error.message,
          name: error.name,
          stack: error.stack
        });

        // User-friendly error message
        alert(`Registration Failed: ${error.message}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Patient Registration</h2>
        <form onSubmit={handleSubmit}>
          {/* Patient Name Input */}
          <div className="input-group">
            <label>Patient Name</label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              placeholder="Enter Full Name"
            />
            {errors.patientName && (
              <div className="error-text">{errors.patientName}</div>
            )}
          </div>

          {/* Date of Birth Input */}
          <div className="input-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
            {errors.dateOfBirth && (
              <div className="error-text">{errors.dateOfBirth}</div>
            )}
          </div>

          {/* Contact Number Input */}
          <div className="input-group">
            <label>Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="10 digit mobile number"
              maxLength="10"
            />
            {errors.contactNumber && (
              <div className="error-text">{errors.contactNumber}</div>
            )}
          </div>

          {/* Emergency Contact Input */}
          <div className="input-group">
            <label>Emergency Contact</label>
            <input
              type="tel"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              placeholder="Emergency contact number"
              maxLength="10"
            />
            {errors.emergencyContact && (
              <div className="error-text">{errors.emergencyContact}</div>
            )}
          </div>

          {/* Gender Input */}
          <div className="input-group">
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <div className="error-text">{errors.gender}</div>
            )}
          </div>

          {/* Email Input */}
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />
            {errors.email && (
              <div className="error-text">{errors.email}</div>
            )}
          </div>

          {/* Password Input */}
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Strong password"
            />
            {errors.password && (
              <div className="error-text">{errors.password}</div>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
            />
            {errors.confirmPassword && (
              <div className="error-text">{errors.confirmPassword}</div>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="signup-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Footer */}
        <div className="signup-footer">
          Already have an account? <a href="/login">Login</a>
        </div>
      </div>
    </div>
  );
};

export default SignUp;