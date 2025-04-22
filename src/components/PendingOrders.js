import React, { useState } from 'react';
import Sidebar from './Sidebar';
import '../Dashboard.css';

function PendingOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'productId', direction: 'asc' });
  const [loadingIndex, setLoadingIndex] = useState(null);

  // Sample data for pending vegetable orders
  const [orders, setOrders] = useState([
    {
      productId: 'V001',
      name: 'Alice Green',
      order: 'Carrots',
      quantity: 5,
      price: 3.00,
      status: 'Pending',
    },
    {
      productId: 'V002',
      name: 'Bob White',
      order: 'Tomatoes',
      quantity: 3,
      price: 2.50,
      status: 'Pending',
    },
    {
      productId: 'V003',
      name: 'Clara Blue',
      order: 'Broccoli',
      quantity: 2,
      price: 4.00,
      status: 'Pending',
    },
    {
      productId: 'V004',
      name: 'David Black',
      order: 'Potatoes',
      quantity: 6,
      price: 1.50,
      status: 'Pending',
    },
    {
      productId: 'V005',
      name: 'Emma Red',
      order: 'Spinach',
      quantity: 4,
      price: 2.00,
      status: 'Pending',
    },
  ]);

  // Filter orders based on the search term and status
  const filteredOrders = orders.filter(
    (order) =>
      (statusFilter === 'All' || order.status === statusFilter) &&
      (order.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
       order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       order.order.toLowerCase().includes(searchTerm.toLowerCase()) ||
       order.quantity.toString().includes(searchTerm) ||
       order.price.toString().includes(searchTerm) ||
       order.status.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort the filtered orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
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
    const order = sortedOrders[index];
    if (window.confirm(`Are you sure you want to approve ${order.name}'s order?`)) {
      setLoadingIndex(index);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const updatedOrders = [...orders];
        const orderIndex = orders.findIndex(
          (o) => o.productId === order.productId && o.name === order.name
        );
        updatedOrders[orderIndex].status = 'Approved';
        setOrders(updatedOrders);
      } catch (error) {
        console.error('Error approving order:', error);
        alert('Failed to approve order. Please try again.');
      } finally {
        setLoadingIndex(null);
      }
    }
  };

  const handleReject = async (index) => {
    const order = sortedOrders[index];
    if (window.confirm(`Are you sure you want to reject ${order.name}'s order?`)) {
      setLoadingIndex(index);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const updatedOrders = [...orders];
        const orderIndex = orders.findIndex(
          (o) => o.productId === order.productId && o.name === order.name
        );
        updatedOrders[orderIndex].status = 'Rejected';
        setOrders(updatedOrders);
      } catch (error) {
        console.error('Error rejecting order:', error);
        alert('Failed to reject order. Please try again.');
      } finally {
        setLoadingIndex(null);
      }
    }
  };

  

  return (
    <div className="dashboard">
      <Sidebar activePage="Pending Orders" />
      <div className="main-content">
        <h1>PENDING ORDERS</h1>
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
                <th onClick={() => sortData('order')} className={sortConfig.key === 'order' ? 'sorted' : ''}>
                  Order {sortConfig.key === 'order' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
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
              {sortedOrders.length > 0 ? (
                sortedOrders.map((order, index) => (
                  <tr key={index} className={`status-${order.status.toLowerCase().replace(' ', '-')}`}>
                    <td>{order.productId}</td>
                    <td>{order.name}</td>
                    <td>{order.order}</td>
                    <td>{order.quantity}</td>
                    <td>₱{order.price.toFixed(2)}</td>
                    <td>{order.status}</td>
                    <td>
                      {order.status === 'Pending' ? (
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
                    No matching orders found.
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

export default PendingOrders;