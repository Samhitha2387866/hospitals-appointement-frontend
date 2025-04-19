import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <h1>COGNIZANT HEALTHCARE</h1>
        </div>
        <div className="navbar-links">
          <Link to="/login" className="login-button">Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Cognizant Healthcare</h1>
          <p>Your health, our priority. Experience world-class healthcare services with us.</p>
          <Link to="/signup" className="get-started-button">Get Started</Link>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="about-content">
          <h2>About Our Hospital</h2>
          <p>
            At Cognizant Healthcare, we are dedicated to providing exceptional medical care 
            with a team of experienced doctors and cutting-edge facilities. Your well-being 
            is our mission.
          </p>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="facilities-section">
        <h2>Explore Our Facilities</h2>
        <div className="facilities-grid">
          <div className="facility-card">
            <h3>Advanced Equipment</h3>
            <p>State-of-the-art medical technology for accurate diagnosis and treatment.</p>
          </div>
          <div className="facility-card">
            <h3>Expert Doctors</h3>
            <p>Highly qualified and experienced medical professionals at your service.</p>
          </div>
          <div className="facility-card">
            <h3>24/7 Emergency</h3>
            <p>Round-the-clock emergency services to handle critical situations.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;