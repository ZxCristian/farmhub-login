import React from 'react';
import Sidebar from './Sidebar';
import '../Dashboard.css';

function PreOrdersHistory() {
  return (
    <div className="dashboard">
      <Sidebar activePage="Pre-Order History" />
      <div className="main-content">
        <h1>PRE-ORDERS HISTORY</h1>
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

export default PreOrdersHistory;