import React, { useState } from 'react';
import Sidebar from './Sidebar';
import '../Dashboard.css';

function ActivePreOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'productId', direction: 'asc' });
  const [selectedPreOrder, setSelectedPreOrder] = useState(null);

  // Sample data for active vegetable pre-orders with effective date and buyer
  const [preOrders, setPreOrders] = useState([
    {
      productId: 'V001',
      farmer: 'Sarah Green',
      preOrder: 'Carrots',
      quantity: 5,
      price: 3.00,
      effectiveDate: '2025-04-15',
      buyer: 'Green Market Co.',
    },
    {
      productId: 'V002',
      farmer: 'Tom Brown',
      preOrder: 'Broccoli',
      quantity: 3,
      price: 4.50,
      effectiveDate: '2025-04-18',
      buyer: 'Fresh Eats LLC',
    },
    {
      productId: 'V003',
      farmer: 'Lisa White',
      preOrder: 'Bell Peppers',
      quantity: 4,
      price: 5.00,
      effectiveDate: '2025-04-10',
      buyer: 'John Doe',
    },
    {
      productId: 'V004',
      farmer: 'Mike Black',
      preOrder: 'Spinach',
      quantity: 2,
      price: 2.50,
      effectiveDate: '2025-04-20',
      buyer: 'Healthy Bites',
    },
    {
      productId: 'V005',
      farmer: 'Emma Blue',
      preOrder: 'Zucchini',
      quantity: 6,
      price: 3.75,
      effectiveDate: '2025-04-12',
      buyer: 'Farm to Table Inc.',
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
      preOrder.effectiveDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      preOrder.buyer.toLowerCase().includes(searchTerm.toLowerCase())
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
      <Sidebar activePage="Active Pre-Order" />
      <div className="main-content">
        <h1>ACTIVE PRE-ORDERS</h1>
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
                <th onClick={() => sortData('buyer')} className={sortConfig.key === 'buyer' ? 'sorted' : ''}>
                  Buyer {sortConfig.key === 'buyer' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
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
                <th onClick={() => sortData('effectiveDate')} className={sortConfig.key === 'effectiveDate' ? 'sorted' : ''}>
                  Effective Date {sortConfig.key === 'effectiveDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
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
                    <td>{preOrder.buyer}</td>
                    <td>{preOrder.preOrder}</td>
                    <td>{preOrder.quantity}</td>
                    <td>₱{preOrder.price.toFixed(2)}</td>
                    <td>{preOrder.effectiveDate}</td>
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
                <h2>{selectedPreOrder.farmer}'s Pre-Order Details</h2>
                <button className="modal-close" onClick={closeModal}>
                  ×
                </button>
              </div>
              <div className="modal-body">
                <p><strong>Product ID:</strong> {selectedPreOrder.productId}</p>
                <p><strong>Farmer:</strong> {selectedPreOrder.farmer}</p>
                <p><strong>Buyer:</strong> {selectedPreOrder.buyer}</p>
                <p><strong>Pre-Order:</strong> {selectedPreOrder.preOrder}</p>
                <p><strong>Quantity:</strong> {selectedPreOrder.quantity}</p>
                <p><strong>Price per Unit:</strong> ₱{selectedPreOrder.price.toFixed(2)}</p>
                <p><strong>Total Price:</strong> ₱{(selectedPreOrder.quantity * selectedPreOrder.price).toFixed(2)}</p>
                <p><strong>Effective Date:</strong> {selectedPreOrder.effectiveDate}</p>
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

export default ActivePreOrders;