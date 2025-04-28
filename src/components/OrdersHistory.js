import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Sidebar from './Sidebar';
import '../Dashboard.css';

function OrdersHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'productId', direction: 'asc' });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Sample data for order history (with vegetables and dates)
  const [orders] = useState(
    Array.from({ length: 10000 }, (_, index) => ({
      productId: `O${200 + index + 1}`,
      name: `Customer ${index + 1}`,
      order: ['Lettuce', 'Cauliflower', 'Kale', 'Cabbage', 'Radishes'][index % 5],
      quantity: Math.floor(Math.random() * 10) + 1,
      price: Math.random() * 5 + 1,
      status: ['Delivered', 'Cancelled'][index % 2],
      date: `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    }))
  );

  // Filter orders based on the search term
  const filteredOrders = orders.filter(
    (order) =>
      order.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.quantity.toString().includes(searchTerm) ||
      (order.quantity * order.price).toString().includes(searchTerm) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort the filtered orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const key = sortConfig.key;
    const direction = sortConfig.direction === 'asc' ? 1 : -1;

    if (key === 'totalPrice') {
      const totalA = a.quantity * a.price;
      const totalB = b.quantity * b.price;
      if (totalA < totalB) return -direction;
      if (totalA > totalB) return direction;
      return 0;
    }

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

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
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

  // Excel export function
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      sortedOrders.map((order) => ({
        'Product ID': order.productId,
        Name: order.name,
        Order: order.order,
        Quantity: order.quantity,
        'Total Price': (order.quantity * order.price).toFixed(2),
        Status: order.status,
        Date: order.date,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'OrdersHistory');
    XLSX.writeFile(workbook, 'OrdersHistory.xlsx');
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxPagesToShow = 5;
    const halfRange = Math.floor(maxPagesToShow / 2);
    let startPage = Math.max(1, currentPage - halfRange);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

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
          aria-label="Go to first page"
        >
          First
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
        >
          Previous
        </button>
        {startPage > 1 && <span>...</span>}
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={currentPage === page ? 'active' : ''}
            aria-label={`Go to page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
        {endPage < totalPages && <span>...</span>}
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Go to last page"
        >
          Last
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
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
      <Sidebar activePage="Orders History" />
      <div className="main-content">
        <h1>ORDER HISTORY</h1>
        <div className="search-bar">
          <button className="action-btn excel" onClick={exportToExcel}>
            Export to Excel
          </button>
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
                <th onClick={() => sortData('totalPrice')} className={sortConfig.key === 'totalPrice' ? 'sorted' : ''}>
                  Total Price {sortConfig.key === 'totalPrice' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => sortData('status')} className={sortConfig.key === 'status' ? 'sorted' : ''}>
                  Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => sortData('date')} className={sortConfig.key === 'date' ? 'sorted' : ''}>
                  Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order, index) => (
                  <tr key={index}>
                    <td>{order.productId}</td>
                    <td>{order.name}</td>
                    <td>{order.order}</td>
                    <td>{order.quantity}kg</td>
                    <td>₱{(order.quantity * order.price).toFixed(2)}</td>
                    <td>{order.status}</td>
                    <td>{order.date}</td>
                    <td>
                      <button
                        className="action-btn view"
                        onClick={() => handleViewDetails(order)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>
                    No matching orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {renderPagination()}
        {selectedOrder && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{selectedOrder.name}'s Order History</h2>
                <button className="modal-close" onClick={closeModal}>
                  ×
                </button>
              </div>
              <div className="modal-body">
                <p><strong>Product ID:</strong> {selectedOrder.productId}</p>
                <p><strong>Name:</strong> {selectedOrder.name}</p>
                <p><strong>Order:</strong> {selectedOrder.order}</p>
                <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
                <p><strong>Price per Unit:</strong> ₱{selectedOrder.price.toFixed(2)}</p>
                <p><strong>Total Price:</strong> ₱{(selectedOrder.quantity * selectedOrder.price).toFixed(2)}</p>
                <p><strong>Status:</strong> {selectedOrder.status}</p>
                <p><strong>Date:</strong> {selectedOrder.date}</p>
              </div>
              <div className="modal-footer">
                <button className="btn-cancel" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersHistory;