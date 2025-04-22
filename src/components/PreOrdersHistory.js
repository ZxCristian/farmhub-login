import React, { useState } from 'react';
import Sidebar from './Sidebar';
import '../Dashboard.css';

function PreOrdersHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'productId', direction: 'asc' });
  const [selectedPreOrder, setSelectedPreOrder] = useState(null);

  // Sample data for pre-order history (with vegetables and dates)
  const [preOrders, setPreOrders] = useState([
    {
      productId: 'V101',
      farmer: 'Anna Taylor',
      preOrder: 'Tomatoes',
      quantity: 8,
      price: 2.50,
      status: 'Completed',
      date: '2025-02-05',
    },
    {
      productId: 'V102',
      farmer: 'Mark Evans',
      preOrder: 'Cucumbers',
      quantity: 4,
      price: 3.00,
      status: 'Completed',
      date: '2025-03-01',
    },
    {
      productId: 'V103',
      farmer: 'Sophie Clark',
      preOrder: 'Potatoes',
      quantity: 10,
      price: 1.50,
      status: 'Cancelled',
      date: '2025-03-20',
    },
    {
      productId: 'V104',
      farmer: 'James Lee',
      preOrder: 'Eggplant',
      quantity: 3,
      price: 4.00,
      status: 'Completed',
      date: '2025-01-15',
    },
    {
      productId: 'V105',
      farmer: 'Laura Harris',
      preOrder: 'Onions',
      quantity: 6,
      price: 2.00,
      status: 'Cancelled',
      date: '2025-04-05',
    },
  ]);

  // Filter pre-orders based on the search term
  const filteredPreOrders = preOrders.filter(
    (preOrder) =>
      preOrder.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      preOrder.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      preOrder.preOrder.toLowerCase().includes(searchTerm.toLowerCase()) ||
      preOrder.quantity.toString().includes(searchTerm) ||
      preOrder.price.toString().includes(searchTerm) ||
      preOrder.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      preOrder.date.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleViewDetails = (preOrder) => {
    setSelectedPreOrder(preOrder);
  };

  const closeModal = () => {
    setSelectedPreOrder(null);
  };

 

  return (
    <div className="dashboard">
      <Sidebar activePage="Pre-Order History" />
      <div className="main-content">
        <h1>PRE-ORDERS HISTORY</h1>
        <div className="search-bar">
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
                <th onClick={() => sortData('farmer')} className={sortConfig.key === 'farmer' ? 'sorted' : ''}>
                  Farmer {sortConfig.key === 'farmer' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
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
                <th onClick={() => sortData('date')} className={sortConfig.key === 'date' ? 'sorted' : ''}>
                  Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedPreOrders.length > 0 ? (
                sortedPreOrders.map((preOrder, index) => (
                  <tr key={index}>
                    <td>{preOrder.productId}</td>
                    <td>{preOrder.farmer}</td>
                    <td>{preOrder.preOrder}</td>
                    <td>{preOrder.quantity}</td>
                    <td>₱{preOrder.price.toFixed(2)}</td>
                    <td>{preOrder.status}</td>
                    <td>{preOrder.date}</td>
                    <td>
                      <button
                        className="action-btn view"
                        onClick={() => handleViewDetails(preOrder)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>
                    No matching pre-orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {selectedPreOrder && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{selectedPreOrder.farmer}'s Pre-Order History</h2>
                <button className="modal-close" onClick={closeModal}>
                  ×
                </button>
              </div>
              <div className="modal-body">
                <p><strong>Product ID:</strong> {selectedPreOrder.productId}</p>
                <p><strong>Farmer:</strong> {selectedPreOrder.farmer}</p>
                <p><strong>Pre-Order:</strong> {selectedPreOrder.preOrder}</p>
                <p><strong>Quantity:</strong> {selectedPreOrder.quantity}</p>
                <p><strong>Price per Unit:</strong> ₱{selectedPreOrder.price.toFixed(2)}</p>
                <p><strong>Total Price:</strong> ₱{(selectedPreOrder.quantity * selectedPreOrder.price).toFixed(2)}</p>
                <p><strong>Status:</strong> {selectedPreOrder.status}</p>
                <p><strong>Date:</strong> {selectedPreOrder.date}</p>
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

export default PreOrdersHistory;