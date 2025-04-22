import React from 'react';
import Sidebar from './Sidebar'; // Import the shared Sidebar component
import '../Dashboard.css';

function OrdersHistory() {
  return (
    <div className="dashboard">
        <Sidebar activePage="Orders History" />
        <div className="main-content">
        <h1>ORDER HISTORY</h1>
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OrdersHistory;   