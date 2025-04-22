import React, { useState } from 'react';
import Sidebar from './Sidebar';
import '../Dashboard.css';

function Members() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [loadingIndex, setLoadingIndex] = useState(null);

  // Sample data for members with updated statuses
  const [members, setMembers] = useState([
    {
      name: 'John Doe',
      address: '123 Main St, Springfield',
      contactNumber: '555-123-4567',
      email: 'john.doe@example.com',
      status: 'Active',
    },
    {
      name: 'Jane Smith',
      address: '456 Oak Ave, Rivertown',
      contactNumber: '555-987-6543',
      email: 'jane.smith@example.com',
      status: 'Active',
    },
    {
      name: 'Michael Brown',
      address: '789 Pine Rd, Lakeside',
      contactNumber: '555-456-7890',
      email: 'michael.brown@example.com',
      status: 'Suspended',
    },
    {
      name: 'Emily Johnson',
      address: '101 Maple Dr, Hillview',
      contactNumber: '555-321-6549',
      email: 'emily.johnson@example.com',
      status: 'Revoked',
    },
    {
      name: 'David Wilson',
      address: '202 Birch Ln, Sunnyvale',
      contactNumber: '555-654-3210',
      email: 'david.wilson@example.com',
      status: 'Active',
    },
  ]);

  // Filter members based on the search term and status
  const filteredMembers = members.filter(
    (member) =>
      (statusFilter === 'All' || member.status === statusFilter) &&
      (member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
       member.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
       member.contactNumber.includes(searchTerm) ||
       member.status.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort the filtered members
  const sortedMembers = [...filteredMembers].sort((a, b) => {
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

  const handleSuspend = async (index) => {
    const member = sortedMembers[index];
    if (window.confirm(`Are you sure you want to suspend ₱{member.name}?`)) {
      setLoadingIndex(index);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const updatedMembers = [...members];
        const memberIndex = members.findIndex(
          (m) => m.name === member.name && m.email === member.email
        );
        updatedMembers[memberIndex].status = 'Suspended';
        setMembers(updatedMembers);
      } catch (error) {
        console.error('Error suspending member:', error);
        alert('Failed to suspend member. Please try again.');
      } finally {
        setLoadingIndex(null);
      }
    }
  };

  const handleRevoke = async (index) => {
    const member = sortedMembers[index];
    if (window.confirm(`Are you sure you want to revoke ₱{member.name}'s membership?`)) {
      setLoadingIndex(index);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const updatedMembers = [...members];
        const memberIndex = members.findIndex(
          (m) => m.name === member.name && m.email === member.email
        );
        updatedMembers[memberIndex].status = 'Revoked';
        setMembers(updatedMembers);
      } catch (error) {
        console.error('Error revoking membership:', error);
        alert('Failed to revoke membership. Please try again.');
      } finally {
        setLoadingIndex(null);
      }
    }
  };

  const handleReactivate = async (index) => {
    const member = sortedMembers[index];
    if (window.confirm(`Are you sure you want to reactivate ₱{member.name}?`)) {
      setLoadingIndex(index);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const updatedMembers = [...members];
        const memberIndex = members.findIndex(
          (m) => m.name === member.name && m.email === member.email
        );
        updatedMembers[memberIndex].status = 'Active';
        setMembers(updatedMembers);
      } catch (error) {
        console.error('Error reactivating member:', error);
        alert('Failed to reactivate member. Please try again.');
      } finally {
        setLoadingIndex(null);
      }
    }
  };

  

  return (
    <div className="dashboard">
      <Sidebar activePage="Members" />
      <div className="main-content">
        <h1>MEMBERS</h1>
        <div className="search-bar">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Revoked">Revoked</option>
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
                <th onClick={() => sortData('name')} className={sortConfig.key === 'name' ? 'sorted' : ''}>
                  Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => sortData('address')} className={sortConfig.key === 'address' ? 'sorted' : ''}>
                  Address {sortConfig.key === 'address' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => sortData('contactNumber')} className={sortConfig.key === 'contactNumber' ? 'sorted' : ''}>
                  Contact Number {sortConfig.key === 'contactNumber' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => sortData('email')} className={sortConfig.key === 'email' ? 'sorted' : ''}>
                  Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => sortData('status')} className={sortConfig.key === 'status' ? 'sorted' : ''}>
                  Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedMembers.length > 0 ? (
                sortedMembers.map((member, index) => (
                  <tr key={index} className={`status-₱{member.status.toLowerCase()}`}>
                    <td>{member.name}</td>
                    <td>{member.address}</td>
                    <td>{member.contactNumber}</td>
                    <td>{member.email}</td>
                    <td>{member.status}</td>
                    <td>
                      {member.status === 'Active' ? (
                        <>
                          <button
                            className="action-btn suspend"
                            onClick={() => handleSuspend(index)}
                            disabled={loadingIndex === index}
                          >
                            {loadingIndex === index ? (
                              <span>
                                <span className="spinner"></span> Suspending...
                              </span>
                            ) : (
                              'Suspend'
                            )}
                          </button>
                          <button
                            className="action-btn revoke"
                            onClick={() => handleRevoke(index)}
                            disabled={loadingIndex === index}
                          >
                            {loadingIndex === index ? (
                              <span>
                                <span className="spinner"></span> Revoking...
                              </span>
                            ) : (
                              'Revoke'
                            )}
                          </button>
                        </>
                      ) : member.status === 'Suspended' ? (
                        <button
                          className="action-btn reactivate"
                          onClick={() => handleReactivate(index)}
                          disabled={loadingIndex === index}
                        >
                          {loadingIndex === index ? (
                            <span>
                              <span className="spinner"></span> Reactivating...
                            </span>
                          ) : (
                            'Reactivate'
                          )}
                        </button>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>
                    No matching members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Members;