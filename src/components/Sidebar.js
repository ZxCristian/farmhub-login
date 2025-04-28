import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Modal from './Modal';
import ChangePasswordForm from './ChangePasswordForm';
import '../Dashboard.css';
import logo from '../assets/Agriville.png';

function Sidebar({ activePage }) {
  const [isModalOpen, setIsModalOpen] = useState(false); // For Change Password modal
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // For Logout modal
  const [isLoggingOut, setIsLoggingOut] = useState(false); // For logout loading state
  const { logout } = useContext(AuthContext);

  // Change Password modal handlers
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Logout modal handlers
  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);

  // Handle logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout(); // Assuming logout is async
      closeLogoutModal();
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally, show an error message to the user
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <div className="sidebar">
        <div className="sidebar-content">
          <img src={logo} alt="FarmHub Logo" className="sidebar-logo" />
          <h2 className="sidebar-title">Administrator</h2>
          <ul className="nav-links">
            <li className={activePage === 'Dashboard' ? 'active' : ''}>
              <Link to="/dashboard">
                <span style={{ marginRight: '8px' }}>📊</span> Dashboard
              </Link>
            </li>
            <li className={activePage === 'Pending Members' ? 'active' : ''}>
              <Link to="/pending-members">
                <span style={{ marginRight: '8px' }}>🙍‍♂️</span> Pending Members
              </Link>
            </li>
            <li className={activePage === 'Pending Orders' ? 'active' : ''}>
              <Link to="/pending-orders">
                <span style={{ marginRight: '8px' }}>🛒</span> Pending Orders
              </Link>
            </li>
            <li className={activePage === 'Pending Pre-Orders' ? 'active' : ''}>
  <Link to="/pending-pre-orders">
    <span style={{ marginRight: '8px' }}>📅</span> Pending Pre-Order
  </Link>
</li>
            <li className={activePage === 'Members' ? 'active' : ''}>
              <Link to="/members">
                <span style={{ marginRight: '8px' }}>👨‍🌾</span> Members
              </Link>
            </li>
            <li className={activePage === 'Customers' ? 'active' : ''}>
              <Link to="/customers">
                <span style={{ marginRight: '8px' }}>🧑‍💻</span> Customers
              </Link>
            </li>
            <li className={activePage === 'Active Pre-Order' ? 'active' : ''}>
              <Link to="/active-pre-orders">
                <span style={{ marginRight: '8px' }}>✅</span> Active Pre-Order
              </Link>
            </li>
            <li className={activePage === 'Pre-Order History' ? 'active' : ''}>
              <Link to="/pre-orders-history">
                <span style={{ marginRight: '8px' }}>📜</span> Pre-Order History
              </Link>
            </li>
            <li className={activePage === 'Orders History' ? 'active' : ''}>
              <Link to="/orders-history">
                <span style={{ marginRight: '8px' }}>🗂️</span> Orders History
              </Link>
            </li>
          </ul>
          <div className="spacer"></div>
          <ul className="bottom-links">
            <li onClick={openModal}>
              <span style={{ marginRight: '8px' }}>🔒</span> Change Password
            </li>
            <li onClick={openLogoutModal}>
              <span style={{ marginRight: '12px' , marginLeft: '4px'}}>↪</span> Logout
            </li>
          </ul>
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Change Password">
        <ChangePasswordForm onClose={closeModal} />
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal isOpen={isLogoutModalOpen} onClose={closeLogoutModal} title="Confirm Logout">
        <p>Are you sure you want to logout?</p>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={closeLogoutModal} disabled={isLoggingOut}>
            Cancel
          </button>
          <button
            className="btn-confirm"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </Modal>
    </>
  );
}

export default Sidebar;