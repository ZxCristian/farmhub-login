import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PendingMembers from './components/PendingMembers';
import PendingOrders from './components/PendingOrders';
import PendingPreOrders from './components/PendingPreOrders';
import Members from './components/Members';
import Customers from './components/Customers';
import ActivePreOrders from './components/ActivePreOrders';
import PreOrdersHistory from './components/PreOrdersHistory';
import OrdersHistory from './components/OrdersHistory';
import './App.css';

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useContext(AuthContext);
  return isLoggedIn ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <AuthProvider> {/* Move AuthProvider inside Router */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pending-members"
            element={
              <ProtectedRoute>
                <PendingMembers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pending-orders"
            element={
              <ProtectedRoute>
                <PendingOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pending-pre-orders"
            element={
              <ProtectedRoute>
                <PendingPreOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/members"
            element={
              <ProtectedRoute>
                <Members />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <Customers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/active-pre-orders"
            element={
              <ProtectedRoute>
                <ActivePreOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pre-orders-history"
            element={
              <ProtectedRoute>
                <PreOrdersHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders-history"
            element={
              <ProtectedRoute>
                <OrdersHistory />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;