import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
 
function Home() {
  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <h1>COGNIZANT HEALTHCARE</h1>
        </div>
        <div className="navbar-links">
          <Link to="/login" className="nav-link">Login</Link>
        </div>
      </nav>
 
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Cognizant Healthcare</h1>
          <p>Your health, our priority. Experience world-class healthcare services with us.</p>
        </div>
      </header>
 
      {/* About Section */}
      <section className="about-hospital">
        <h2>About Our Hospital</h2>
        <p>
          At Cognizant Healthcare, we are dedicated to providing exceptional medical care
          with a team of experienced doctors and cutting-edge facilities. Your well-being
          is our mission.
        </p>
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
          <div className="facility-card">
            <h3>Patient-Centered Care</h3>
            <p>We prioritize your comfort and satisfaction with personalized care plans.</p>
          </div>
          <div className="facility-card">
            <h3>Pharmacy Services</h3>
            <p>Convenient pharmacy for easy access to your medications</p>
          </div>
        </div>
      </section>
 
      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>What Our Patients Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>"The doctors and staff were incredibly supportive and professional. Highly recommend!"</p>
            <h4>- John Doe</h4>
          </div>
          <div className="testimonial-card">
            <p>"I received excellent care during my treatment. The facilities are top-notch."</p>
            <h4>- Jane Smith</h4>
          </div>
          <div className="testimonial-card">
            <p>"The 24/7 emergency services saved my life. Thank you, Cognizant Healthcare!"</p>
            <h4>- Michael Brown</h4>
          </div>
        </div>
      </section>
 
      {/* Footer Section */}
      <footer className="footer">
        <p>&copy; 2025 Cognizant Healthcare. All rights reserved.</p>
        <div className="footer-links">
          <Link to="/terms" className="footer-link">Terms of Service</Link>
          <Link to="/privacy" className="footer-link">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
}
 
export default Home;
 