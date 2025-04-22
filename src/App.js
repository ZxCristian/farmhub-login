import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PendingMembers from './components/PendingMembers';
import PendingOrders from './components/PendingOrders';
import PendingPreOrders from './components/PendingPreOrders';
import Members from './components/Members';
import ActivePreOrders from './components/ActivePreOrders';
import PreOrdersHistory from './components/PreOrdersHistory';
import OrdersHistory from './components/OrdersHistory'; // Already included
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pending-members" element={<PendingMembers />} />
        <Route path="/pending-orders" element={<PendingOrders />} />
        <Route path="/pending-pre-orders" element={<PendingPreOrders />} />
        <Route path="/members" element={<Members />} />
        <Route path="/active-pre-orders" element={<ActivePreOrders />} />
        <Route path="/pre-orders-history" element={<PreOrdersHistory />} />
        <Route path="/orders-history" element={<OrdersHistory />} />
      </Routes>
    </Router>
  );
}

export default App;