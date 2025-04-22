import React from 'react';
import Sidebar from './Sidebar'; // Already imported and correct
import '../Dashboard.css';

function Members() {
  return (
    <div className="dashboard">
      <Sidebar activePage="Members" /> {/* Keep this */}
      <div className="main-content">
        <h1>MEMBERS</h1>
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

export default Members;