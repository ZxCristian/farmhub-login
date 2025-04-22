import React, { useState } from 'react';
import Sidebar from './Sidebar';
import '../Dashboard.css';

function OrdersHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'productId', direction: 'asc' });
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Sample data for order history (with vegetables and dates)
  const [orders, setOrders] = useState([
    {
      productId: 'O201',
      name: 'Rachel Adams',
      order: 'Lettuce',
      quantity: 5,
      price: 2.00,
      status: 'Delivered',
      date: '2025-03-10',
    },
    {
      productId: 'O202',
      name: 'Ethan Brooks',
      order: 'Cauliflower',
      quantity: 3,
      price: 3.50,
      status: 'Delivered',
      date: '2025-03-15',
    },
    {
      productId: 'O203',
      name: 'Olivia Carter',
      order: 'Kale',
      quantity: 6,
      price: 2.75,
      status: 'Cancelled',
      date: '2025-04-01',
    },
    {
      productId: 'O204',
      name: 'Nathan Hayes',
      order: 'Cabbage',
      quantity: 4,
      price: 2.25,
      status: 'Delivered',
      date: '2025-02-20',
    },
    {
      productId: 'O205',
      name: 'Mia Foster',
      order: 'Radishes',
      quantity: 7,
      price: 1.80,
      status: 'Cancelled',
      date: '2025-03-25',
    },
  ]);

  // Filter orders based on the search term
  const filteredOrders = orders.filter(
    (order) =>
      order.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.quantity.toString().includes(searchTerm) ||
      order.price.toString().includes(searchTerm) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.date.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  

  return (
    <div className="dashboard">
      <Sidebar activePage="Orders History" />
      <div className="main-content">
        <h1>ORDER HISTORY</h1>
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
                <th onClick={() => sortData('date')} className={sortConfig.key === 'date' ? 'sorted' : ''}>
                  Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.length > 0 ? (
                sortedOrders.map((order, index) => (
                  <tr key={index}>
                    <td>{order.productId}</td>
                    <td>{order.name}</td>
                    <td>{order.order}</td>
                    <td>{order.quantity}</td>
                    <td>₱{order.price.toFixed(2)}</td>
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