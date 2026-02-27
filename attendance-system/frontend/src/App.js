import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import Reports from './pages/Reports';

import PrivateRoute from './components/PrivateRoute';

function App() {

  return (
    <AuthProvider>

      <Router>

        <div className="App">

          <Navbar />

          <div className="container">

            <Routes>

              {/* PUBLIC ROUTES */}

              <Route path="/" element={<Home />} />

              <Route path="/login" element={<Login />} />

              <Route path="/register" element={<Register />} />

              {/* PRIVATE ROUTES */}

              {/* Dashboard - both roles */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute allowedRoles={["teacher","student"]}>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              {/* Teacher Only */}
              <Route
                path="/students"
                element={
                  <PrivateRoute allowedRoles={["teacher"]}>
                    <Students />
                  </PrivateRoute>
                }
              />

              {/* Teacher Only */}
              <Route
                path="/attendance"
                element={
                  <PrivateRoute allowedRoles={["teacher"]}>
                    <Attendance />
                  </PrivateRoute>
                }
              />

              {/* Both roles */}
              <Route
                path="/reports"
                element={
                  <PrivateRoute allowedRoles={["teacher","student"]}>
                    <Reports />
                  </PrivateRoute>
                }
              />

            </Routes>

          </div>

        </div>

      </Router>

    </AuthProvider>
  );
}

export default App;