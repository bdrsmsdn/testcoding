import React from 'react';
import { Routes, Route } from 'react-router-dom';

import './App.css';
import { Login, Dashboard, Cars, OrdersAdmin, DashboardAdmin, OrdersUser } from './pages';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/orders-admin" element={<OrdersAdmin />} />
        <Route path="/orders" element={<OrdersUser />} />
      </Routes>
    </div>
  );
}

export default App;
