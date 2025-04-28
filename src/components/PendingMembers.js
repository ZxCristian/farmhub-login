import React, { useState } from 'react';
import Sidebar from './Sidebar';
import '../Dashboard.css';

function PendingMembers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Function to generate a numeric ID
  const generateNumericId = () => {
    return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit ID
  };

  // Sample data for pending members
  const [members, setMembers] = useState([
    { name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890', status: 'Pending' },
    { name: 'Jane Smith', email: 'jane.smith@example.com', phone: '234-567-8901', status: 'Pending' },
    { name: 'Alice Johnson', email: 'alice.j@example.com', phone: '345-678-9012', status: 'Pending' },
    // Add more sample data as needed
  ]);

  // Filter members to only show Pending status
  const filteredMembers = members.filter(
    (member) =>
      member.status === 'Pending' &&
      (member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
       member.phone.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort the filtered members
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    const key = sortConfig.key;
    const direction = sortConfig.direction === 'asc' ? 1 : -1;

    if (a[key] < b[key]) return -direction;
    if (a[key] > b[key]) return direction;
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedMembers.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedMembers = sortedMembers.slice(startIndex, startIndex + recordsPerPage);

  const sortData = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const handleApprove = async (index) => {
    const member = paginatedMembers[index];
    if (window.confirm(`Are you sure you want to approve ${member.name}'s membership?`)) {
      setLoadingIndex(index);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Assign a numeric ID to the approved member
        const numericId = generateNumericId();
        // Remove the approved member from the list
        const updatedMembers = members.filter(
          (m) => !(m.name === member.name && m.email === member.email)
        );
        // In a real app, you might send the member with numericId to an API
        console.log(`Approved member ${member.name} with ID ${numericId}`);
        setMembers(updatedMembers);
      } catch (error) {
        console.error('Error approving member:', error);
        alert('Failed to approve member. Please try again.');
      } finally {
        setLoadingIndex(null);
      }
    }
  };

  const handleReject = async (index) => {
    const member = paginatedMembers[index];
    if (window.confirm(`Are you sure you want to reject ${member.name}'s membership?`)) {
      setLoadingIndex(index);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Remove the rejected member from the list
        const updatedMembers = members.filter(
          (m) => !(m.name === member.name && m.email === member.email)
        );
        setMembers(updatedMembers);
      } catch (error) {
        console.error('Error rejecting member:', error);
        alert('Failed to reject member. Please try again.');
      } finally {
        setLoadingIndex(null);
      }
    }
  };

  const handleRecordsPerPageChange = (e) => {
    const value = e.target.value === '100' ? sortedMembers.length : Number(e.target.value);
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
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={currentPage === page ? 'active' : ''}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <span>
          Page {currentPage} of {totalPages} | Total Members: {sortedMembers.length}
        </span>
      </div>
    );
  };

  return (
    <div className="dashboard">
      <Sidebar activePage="Pending Members" />
      <div className="main-content">
        <h1>PENDING MEMBERS</h1>
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
                <th onClick={() => sortData('name')} className={sortConfig.key === 'name' ? 'sorted' : ''}>
                  Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => sortData('email')} className={sortConfig.key === 'email' ? 'sorted' : ''}>
                  Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => sortData('phone')} className={sortConfig.key === 'phone' ? 'sorted' : ''}>
                  Phone {sortConfig.key === 'phone' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => sortData('status')} className={sortConfig.key === 'status' ? 'sorted' : ''}>
                  Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMembers.length > 0 ? (
                paginatedMembers.map((member, index) => (
                  <tr key={index} className={`status-${member.status.toLowerCase().replace(' ', '-')}`}>
                    <td>{member.name}</td>
                    <td>{member.email}</td>
                    <td>{member.phone}</td>
                    <td>{member.status}</td>
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
                  <td colSpan="5" style={{ textAlign: 'center' }}>
                    No pending members found.
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

export default PendingMembers;