import React from 'react';
import Sidebar from './Sidebar'; // Import the Sidebar component
import '../Dashboard.css';

function PendingMembers() {
  return (
    <div className="dashboard">
      <Sidebar activePage="Pending Members" />
      <div className="main-content">
        <h1>PENDING MEMBERS</h1>
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Contact Number</th>
                <th>Email</th>
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

export default PendingMembers;