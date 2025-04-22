import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Missing in your code, but required for Link
import Modal from './Modal';
import ChangePasswordForm from './ChangePasswordForm';
import '../Dashboard.css';

function Sidebar({ activePage }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="sidebar">
        <h2>FarmHub Admin</h2>
        <ul>
          <li className={activePage === 'Dashboard' ? 'active' : ''}>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className={activePage === 'Pending Members' ? 'active' : ''}>
            <Link to="/pending-members">Pending Members</Link>
          </li>
          <li className={activePage === 'Pending Orders' ? 'active' : ''}>
            <Link to="/pending-orders">Pending Orders</Link>
          </li>
          <li className={activePage === 'Pending Pre-Order' ? 'active' : ''}>
            <Link to="/pending-pre-orders">Pending Pre-Order</Link>
          </li>
          <li className={activePage === 'Members' ? 'active' : ''}>
            <Link to="/members">Members</Link>
          </li>
          <li className={activePage === 'Active Pre-Order' ? 'active' : ''}>
            <Link to="/active-pre-orders">Active Pre-Order</Link>
          </li>
          <li className={activePage === 'Pre-Order History' ? 'active' : ''}>
            <Link to="/pre-orders-history">Pre-Order History</Link>
          </li>
          <li className={activePage === 'Orders History' ? 'active' : ''}>
            <Link to="/orders-history">Orders History</Link>
          </li>
          
          <li onClick={openModal}>Change Password</li>
          <li>
            <Link to="/">Logout</Link>
          </li>
        </ul>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Change Password">
        <ChangePasswordForm onClose={closeModal} />
      </Modal>
    </>
  );
}

export default Sidebar;