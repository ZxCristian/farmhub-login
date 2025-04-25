import React, { useState } from 'react';
import Sidebar from './Sidebar';
import '../Dashboard.css';

function PendingOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'productId', direction: 'asc' });
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Sample data for pending vegetable orders
  const [orders, setOrders] = useState([
    { productId: 'V001', name: 'Grace Yellow', order: 'Tomatoes', quantity: 3, price: 3.96, status: 'Pending' },
    { productId: 'V002', name: 'Emma Red', order: 'Cabbage', quantity: 1, price: 4.94, status: 'Pending' },
    { productId: 'V003', name: 'Alice Green', order: 'Spinach', quantity: 7, price: 3.27, status: 'Pending' },
    { productId: 'V004', name: 'David Black', order: 'Peppers', quantity: 9, price: 2.53, status: 'Pending' },
    { productId: 'V005', name: 'Hank Violet', order: 'Cabbage', quantity: 10, price: 1.15, status: 'Pending' },
    { productId: 'V006', name: 'Grace Yellow', order: 'Cabbage', quantity: 6, price: 2.23, status: 'Pending' },
    { productId: 'V007', name: 'Emma Red', order: 'Spinach', quantity: 5, price: 1.91, status: 'Pending' },
    { productId: 'V008', name: 'Alice Green', order: 'Cucumbers', quantity: 4, price: 4.79, status: 'Pending' },
    { productId: 'V009', name: 'Ivy Indigo', order: 'Tomatoes', quantity: 4, price: 3.46, status: 'Pending' },
    { productId: 'V010', name: 'Grace Yellow', order: 'Broccoli', quantity: 2, price: 3.37, status: 'Pending' },
    { productId: 'V011', name: 'David Black', order: 'Lettuce', quantity: 1, price: 4.17, status: 'Pending' },
    { productId: 'V012', name: 'David Black', order: 'Onions', quantity: 7, price: 4.36, status: 'Pending' },
    { productId: 'V013', name: 'David Black', order: 'Tomatoes', quantity: 5, price: 3.14, status: 'Pending' },
    { productId: 'V014', name: 'Emma Red', order: 'Peppers', quantity: 2, price: 3.49, status: 'Pending' },
    { productId: 'V015', name: 'Ivy Indigo', order: 'Cabbage', quantity: 4, price: 4.21, status: 'Pending' },
    { productId: 'V016', name: 'Alice Green', order: 'Peppers', quantity: 10, price: 2.2, status: 'Pending' },
    { productId: 'V017', name: 'Alice Green', order: 'Tomatoes', quantity: 6, price: 3.41, status: 'Pending' },
    { productId: 'V018', name: 'Frank Orange', order: 'Spinach', quantity: 2, price: 3.14, status: 'Pending' },
    { productId: 'V019', name: 'Bob White', order: 'Lettuce', quantity: 2, price: 1.49, status: 'Pending' },
    { productId: 'V020', name: 'Emma Red', order: 'Tomatoes', quantity: 6, price: 2.47, status: 'Pending' },
    { productId: 'V021', name: 'Bob White', order: 'Lettuce', quantity: 9, price: 1.3, status: 'Pending' },
    { productId: 'V022', name: 'David Black', order: 'Peppers', quantity: 1, price: 2.94, status: 'Pending' },
    { productId: 'V023', name: 'Bob White', order: 'Cabbage', quantity: 7, price: 3.4, status: 'Pending' },
    { productId: 'V024', name: 'Grace Yellow', order: 'Peppers', quantity: 5, price: 1.88, status: 'Pending' },
    { productId: 'V025', name: 'Emma Red', order: 'Lettuce', quantity: 3, price: 2.67, status: 'Pending' },
    { productId: 'V026', name: 'Grace Yellow', order: 'Onions', quantity: 1, price: 4.71, status: 'Pending' },
    { productId: 'V027', name: 'David Black', order: 'Broccoli', quantity: 2, price: 2.97, status: 'Pending' },
    { productId: 'V028', name: 'David Black', order: 'Tomatoes', quantity: 4, price: 1.08, status: 'Pending' },
    { productId: 'V029', name: 'Frank Orange', order: 'Cabbage', quantity: 1, price: 4.15, status: 'Pending' },
    { productId: 'V030', name: 'Ivy Indigo', order: 'Broccoli', quantity: 9, price: 2.63, status: 'Pending' },
    { productId: 'V031', name: 'Bob White', order: 'Cucumbers', quantity: 9, price: 2.37, status: 'Pending' },
    { productId: 'V032', name: 'Emma Red', order: 'Broccoli', quantity: 8, price: 2.91, status: 'Pending' },
    { productId: 'V033', name: 'Jack Brown', order: 'Lettuce', quantity: 9, price: 4.25, status: 'Pending' },
    { productId: 'V034', name: 'Emma Red', order: 'Peppers', quantity: 5, price: 1.66, status: 'Pending' },
    { productId: 'V035', name: 'Alice Green', order: 'Tomatoes', quantity: 5, price: 3.33, status: 'Pending' },
    { productId: 'V036', name: 'Bob White', order: 'Spinach', quantity: 6, price: 4.99, status: 'Pending' },
    { productId: 'V037', name: 'Alice Green', order: 'Cabbage', quantity: 3, price: 4.67, status: 'Pending' },
    { productId: 'V038', name: 'Grace Yellow', order: 'Cabbage', quantity: 6, price: 3.01, status: 'Pending' },
    { productId: 'V039', name: 'Hank Violet', order: 'Lettuce', quantity: 7, price: 4.18, status: 'Pending' },
    { productId: 'V040', name: 'Bob White', order: 'Onions', quantity: 5, price: 1.77, status: 'Pending' },
    { productId: 'V041', name: 'Alice Green', order: 'Cucumbers', quantity: 8, price: 1.47, status: 'Pending' },
    { productId: 'V042', name: 'Alice Green', order: 'Carrots', quantity: 6, price: 3.11, status: 'Pending' },
    { productId: 'V043', name: 'Frank Orange', order: 'Onions', quantity: 2, price: 3.91, status: 'Pending' },
    { productId: 'V044', name: 'Bob White', order: 'Tomatoes', quantity: 5, price: 3.59, status: 'Pending' },
    { productId: 'V045', name: 'Grace Yellow', order: 'Onions', quantity: 4, price: 3.26, status: 'Pending' },
    { productId: 'V046', name: 'Emma Red', order: 'Tomatoes', quantity: 9, price: 3.97, status: 'Pending' },
    { productId: 'V047', name: 'Jack Brown', order: 'Carrots', quantity: 4, price: 4.86, status: 'Pending' },
    { productId: 'V048', name: 'Frank Orange', order: 'Cucumbers', quantity: 5, price: 3.92, status: 'Pending' },
    { productId: 'V049', name: 'David Black', order: 'Spinach', quantity: 1, price: 3.5, status: 'Pending' },
    { productId: 'V050', name: 'David Black', order: 'Cabbage', quantity: 2, price: 4.72, status: 'Pending' },
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

  // Pagination logic
  const totalPages = Math.ceil(sortedOrders.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedOrders = sortedOrders.slice(startIndex, startIndex + recordsPerPage);

  const sortData = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const handleApprove = async (index) => {
    const order = paginatedOrders[index];
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
    const order = paginatedOrders[index];
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

  const handleRecordsPerPageChange = (e) => {
    const value = e.target.value === '100' ? sortedOrders.length : Number(e.target.value);
    setRecordsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing records per page
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={currentPage === page ? 'active' : ''}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <span>
          Page {currentPage} of {totalPages} | Total Orders: {sortedOrders.length}
        </span>
      </div>
    );
  };

  return (
    <div className="dashboard">
      <Sidebar activePage="Pending Orders" />
      <div className="main-content">
        <h1>PENDING ORDERS</h1>
        <div className="search-bar">
          <select
            value={recordsPerPage}
            onChange={handleRecordsPerPageChange}
            className="records-per-page"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">All</option>
          </select>
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
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order, index) => (
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
        {renderPagination()}
      </div>
    </div>
  );
}

export default PendingOrders;