import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Booking from './pages/Booking';
import StakeholderProfile from './pages/StakeholderProfile';
import Transactions from './pages/Transactions';
import { StakeholderProvider } from './context/StakeholderContext';
import { PaymentProvider } from './context/PaymentContext';

function App() {
  return (
    <StakeholderProvider>
      <PaymentProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/profile" element={<StakeholderProfile />} />
              <Route path="/transactions" element={<Transactions />} />
            </Routes>
          </div>
        </Router>
      </PaymentProvider>
    </StakeholderProvider>
  );
}

export default App;