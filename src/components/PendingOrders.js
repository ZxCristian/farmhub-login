import React, { useState } from 'react';
import Sidebar from './Sidebar';
import '../Dashboard.css';

function PendingOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'productId', direction: 'asc' });
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Sample data for pending vegetable orders
  const [orders, setOrders] = useState(Array.from({ length: 10000 }, (_, i) => ({
    productId: `V${String(i + 1).padStart(3, '0')}`,
    name: ['Grace Yellow', 'Emma Red', 'Alice Green', 'David Black', 'Hank Violet', 'Ivy Indigo', 'Frank Orange', 'Bob White', 'Jack Brown'][i % 9],
    order: ['Tomatoes', 'Cabbage', 'Spinach', 'Peppers', 'Lettuce', 'Onions', 'Broccoli', 'Cucumbers', 'Carrots'][i % 9],
    quantity: Math.floor(Math.random() * 10) + 1,
    price: parseFloat((Math.random() * 5).toFixed(2)),
    status: 'Pending',
  })));

  // Filter orders to only show Pending status
  const filteredOrders = orders.filter(
    (order) =>
      order.status === 'Pending' &&
      (order.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
       order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       order.order.toLowerCase().includes(searchTerm.toLowerCase()) ||
       order.quantity.toString().includes(searchTerm) ||
       order.price.toString().includes(searchTerm))
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
  const totalPages = Math.max(1, Math.ceil(sortedOrders.length / recordsPerPage));
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
        // Remove the approved order from the list
        const updatedOrders = orders.filter(
          (o) => !(o.productId === order.productId && o.name === order.name)
        );
        setOrders(updatedOrders);
        // Adjust currentPage if the current page becomes empty
        if (paginatedOrders.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
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
        // Remove the rejected order from the list
        const updatedOrders = orders.filter(
          (o) => !(o.productId === order.productId && o.name === order.name)
        );
        setOrders(updatedOrders);
        // Adjust currentPage if the current page becomes empty
        if (paginatedOrders.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
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
    const maxPagesToShow = 5; // Show current page ± 2
    const halfRange = Math.floor(maxPagesToShow / 2);
    let startPage = Math.max(1, currentPage - halfRange);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Adjust startPage if endPage is at the totalPages
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          First
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {startPage > 1 && <span>...</span>}
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={currentPage === page ? 'active' : ''}
          >
            {page}
          </button>
        ))}
        {endPage < totalPages && <span>...</span>}
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          Last
        </button>
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
                    <td>{order.quantity}kg</td>
                    <td>₱{order.price.toFixed(2)}</td>
                    <td>
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
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>
                    No pending orders found.
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