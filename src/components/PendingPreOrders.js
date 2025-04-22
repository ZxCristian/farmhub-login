import React, { useState } from 'react';
import Sidebar from './Sidebar';
import '../Dashboard.css';

function PendingPreOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'productId', direction: 'asc' });
  const [loadingIndex, setLoadingIndex] = useState(null);

  // Sample data for pending vegetable pre-orders
  const [preOrders, setPreOrders] = useState([
    {
      productId: 'V001',
      name: 'Sarah Green',
      preOrder: 'Carrots',
      quantity: 5,
      price: 3.00,
      status: 'Pending',
    },
    {
      productId: 'V002',
      name: 'Tom Brown',
      preOrder: 'Broccoli',
      quantity: 3,
      price: 4.50,
      status: 'Pending',
    },
    {
      productId: 'V003',
      name: 'Lisa White',
      preOrder: 'Bell Peppers',
      quantity: 4,
      price: 5.00,
      status: 'Pending',
    },
    {
      productId: 'V004',
      name: 'Mike Black',
      preOrder: 'Spinach',
      quantity: 2,
      price: 2.50,
      status: 'Pending',
    },
    {
      productId: 'V005',
      name: 'Emma Blue',
      preOrder: 'Zucchini',
      quantity: 6,
      price: 3.75,
      status: 'Pending',
    },
  ]);

  // Filter pre-orders based on the search term and status
  const filteredPreOrders = preOrders.filter(
    (preOrder) =>
      (statusFilter === 'All' || preOrder.status === statusFilter) &&
      (preOrder.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
       preOrder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       preOrder.preOrder.toLowerCase().includes(searchTerm.toLowerCase()) ||
       preOrder.quantity.toString().includes(searchTerm) ||
       preOrder.price.toString().includes(searchTerm) ||
       preOrder.status.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort the filtered pre-orders
  const sortedPreOrders = [...filteredPreOrders].sort((a, b) => {
    const key = sortConfig.key;
    const direction = sortConfig.direction === 'asc' ? 1 : -1;

    if (a[key] < b[key]) return -direction;
    if (a[key] > b[key]) return direction;
    return 0;
  });

  const sortData = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const handleApprove = async (index) => {
    const preOrder = sortedPreOrders[index];
    if (window.confirm(`Are you sure you want to approve ₱{preOrder.name}'s pre-order?`)) {
      setLoadingIndex(index);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const updatedPreOrders = [...preOrders];
        const preOrderIndex = preOrders.findIndex(
          (p) => p.productId === preOrder.productId && p.name === preOrder.name
        );
        updatedPreOrders[preOrderIndex].status = 'Approved';
        setPreOrders(updatedPreOrders);
      } catch (error) {
        console.error('Error approving pre-order:', error);
        alert('Failed to approve pre-order. Please try again.');
      } finally {
        setLoadingIndex(null);
      }
    }
  };

  const handleReject = async (index) => {
    const preOrder = sortedPreOrders[index];
    if (window.confirm(`Are you sure you want to reject ₱{preOrder.name}'s pre-order?`)) {
      setLoadingIndex(index);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const updatedPreOrders = [...preOrders];
        const preOrderIndex = preOrders.findIndex(
          (p) => p.productId === preOrder.productId && p.name === preOrder.name
        );
        updatedPreOrders[preOrderIndex].status = 'Rejected';
        setPreOrders(updatedPreOrders);
      } catch (error) {
        console.error('Error rejecting pre-order:', error);
        alert('Failed to reject pre-order. Please try again.');
      } finally {
        setLoadingIndex(null);
      }
    }
  };

 

  return (
    <div className="dashboard">
      <Sidebar activePage="Pending Pre-Order" />
      <div className="main-content">
        <h1>PENDING PRE-ORDERS</h1>
        <div className="search-bar">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
         
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th onClick={() => sortData('productId')} className={sortConfig.key === 'productId' ? 'sorted' : ''}>
                  Product ID {sortConfig.key === 'productId' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => sortData('name')} className={sortConfig.key === 'name' ? 'sorted' : ''}>
                  Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => sortData('preOrder')} className={sortConfig.key === 'preOrder' ? 'sorted' : ''}>
                  Pre-Order {sortConfig.key === 'preOrder' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => sortData('quantity')} className={sortConfig.key === 'quantity' ? 'sorted' : ''}>
                  Quantity {sortConfig.key === 'quantity' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => sortData('price')} className={sortConfig.key === 'price' ? 'sorted' : ''}>
                  Price {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => sortData('status')} className={sortConfig.key === 'status' ? 'sorted' : ''}>
                  Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedPreOrders.length > 0 ? (
                sortedPreOrders.map((preOrder, index) => (
                  <tr key={index} className={`status-₱{preOrder.status.toLowerCase().replace(' ', '-')}`}>
                    <td>{preOrder.productId}</td>
                    <td>{preOrder.name}</td>
                    <td>{preOrder.preOrder}</td>
                    <td>{preOrder.quantity}</td>
                    <td>₱{preOrder.price.toFixed(2)}</td>
                    <td>{preOrder.status}</td>
                    <td>
                      {preOrder.status === 'Pending'  ? (
                        <>
                          <button
                            className="action-btn approve"
                            onClick={() => handleApprove(index)}
                            disabled={loadingIndex === index}
                          >
                            {loadingIndex === index ? (
                              <span>
                                <span className="spinner"></span> Approving...
                              </span>
                            ) : (
                              'Approve'
                            )}
                          </button>
                          <button
                            className="action-btn reject"
                            onClick={() => handleReject(index)}
                            disabled={loadingIndex === index}
                          >
                            {loadingIndex === index ? (
                              <span>
                                <span className="spinner"></span> Rejecting...
                              </span>
                            ) : (
                              'Reject'
                            )}
                          </button>
                        </>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>
                    No matching pre-orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PendingPreOrders;