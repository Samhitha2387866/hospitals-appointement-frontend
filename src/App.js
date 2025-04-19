import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Authentication/Login/Login";
import Signup from "./components/Authentication/SignUp/SignUp";
import ForgotPassword from "./components/Authentication/ForgotPassword/ForgotPassword";
import PatientDashboard from "./components/Patient/PatientDashboard/PatientDashboard";
import BookAppointment from "./components/Patient/BookAppointment/BookAppointment";
import MedicalHistory from "./components/Patient/MedicalHistory/MEdicalHistory";
import Profile from "./components/common/Profile/Profile";
import DoctorDashboard from "./components/Doctor/DoctorDashboard/DoctorDashboard";
import ProtectedRoute from "./components/common/ProtectedRoute/ProtectedRoute";
import DoctorProfile from "./components/Doctor/DoctorProfile/DoctorProfile"; 

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/patient-dashboard",
    element: (
      <ProtectedRoute userType="patient">
        <PatientDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/patient-dashboard/book-appointment",
    element: (
      <ProtectedRoute userType="patient">
        <BookAppointment />
      </ProtectedRoute>
    ),
  },
  {
    path: "/patient-dashboard/medical-history",
    element: (
      <ProtectedRoute userType="patient">
        <MedicalHistory />
      </ProtectedRoute>
    ),
  },
  {
    path: "/patient-dashboard/profile",
    element: (
      <ProtectedRoute userType="patient">
        <Profile userType="patient" />
      </ProtectedRoute>
    ),
  },
  {
    path: "/doctor-dashboard",
    element: (
      <ProtectedRoute userType="doctor">
        <DoctorDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/doctor-dashboard/appointments",
    element: (
      <ProtectedRoute userType="doctor">
        <DoctorDashboard activeSection="appointments" />
      </ProtectedRoute>
    ),
  },
  {
    path: "/doctor-dashboard/review-time-slots",
    element: (
      <ProtectedRoute userType="doctor">
        <DoctorDashboard activeSection="review-time-slots" />
      </ProtectedRoute>
    ),
  },
  {
    path: "/doctor-dashboard/profile/:doctorId",
    element: (
      <ProtectedRoute userType="doctor">
        <DoctorProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <Home />,
  },
], {
  future: {
    v7_relativeSplatPath: true,
    v7_startTransition: true,
  },
});

function App() {
  return <RouterProvider router={router} />;
}

export default App;