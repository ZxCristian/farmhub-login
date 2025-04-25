import React, { useState } from 'react';
import Sidebar from './Sidebar';
import '../Dashboard.css';

function PendingMembers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Sample data for pending members
  const [members, setMembers] = useState([
    { name: 'Olivia Thomas', address: '205 Main St, Rivertown', contactNumber: '555-691-9735', email: 'olivia.thomas@example.com', status: 'Pending' },
    { name: 'Olivia Johnson', address: '646 Oak Ave, Clearwater', contactNumber: '555-660-1971', email: 'olivia.johnson@example.com', status: 'Pending' },
    { name: 'Emily Smith', address: '731 Birch Ln, Hillview', contactNumber: '555-606-9075', email: 'emily.smith@example.com', status: 'Pending' },
    { name: 'Michael Thomas', address: '906 Main St, Rivertown', contactNumber: '555-742-6272', email: 'michael.thomas@example.com', status: 'Pending' },
    { name: 'Olivia Johnson', address: '706 Oak Ave, Fairview', contactNumber: '555-503-4612', email: 'olivia.johnson@example.com', status: 'Pending' },
    { name: 'Michael Taylor', address: '362 Elm St, Springfield', contactNumber: '555-328-5364', email: 'michael.taylor@example.com', status: 'Pending' },
    { name: 'Sarah Brown', address: '392 Birch Ln, Rivertown', contactNumber: '555-227-5462', email: 'sarah.brown@example.com', status: 'Pending' },
    { name: 'Sarah Brown', address: '861 Maple Dr, Brookfield', contactNumber: '555-437-3642', email: 'sarah.brown@example.com', status: 'Pending' },
    { name: 'Emily Smith', address: '733 Ash Ct, Rosewood', contactNumber: '555-883-6743', email: 'emily.smith@example.com', status: 'Pending' },
    { name: 'Chris Taylor', address: '834 Cedar St, Clearwater', contactNumber: '555-175-1944', email: 'chris.taylor@example.com', status: 'Pending' },
    { name: 'Jane Smith', address: '150 Elm St, Lakeside', contactNumber: '555-404-9861', email: 'jane.smith@example.com', status: 'Pending' },
    { name: 'David Anderson', address: '479 Willow Ln, Hillview', contactNumber: '555-693-1039', email: 'david.anderson@example.com', status: 'Pending' },
    { name: 'Michael Brown', address: '350 Willow Ln, Springfield', contactNumber: '555-181-2081', email: 'michael.brown@example.com', status: 'Pending' },
    { name: 'Emily Wilson', address: '328 Cedar St, Brookfield', contactNumber: '555-847-2600', email: 'emily.wilson@example.com', status: 'Pending' },
    { name: 'Daniel White', address: '803 Main St, Rivertown', contactNumber: '555-116-7598', email: 'daniel.white@example.com', status: 'Pending' },
    { name: 'John Anderson', address: '678 Oak Ave, Lakeside', contactNumber: '555-419-8925', email: 'john.anderson@example.com', status: 'Pending' },
    { name: 'Chris Smith', address: '607 Birch Ln, Clearwater', contactNumber: '555-772-5421', email: 'chris.smith@example.com', status: 'Pending' },
    { name: 'Sarah Wilson', address: '131 Ash Ct, Fairview', contactNumber: '555-144-8893', email: 'sarah.wilson@example.com', status: 'Pending' },
    { name: 'David White', address: '708 Spruce Rd, Brookfield', contactNumber: '555-282-7091', email: 'david.white@example.com', status: 'Pending' },
    { name: 'Laura Thomas', address: '395 Elm St, Springfield', contactNumber: '555-334-3124', email: 'laura.thomas@example.com', status: 'Pending' },
    { name: 'Daniel Wilson', address: '172 Pine Rd, Rivertown', contactNumber: '555-603-4738', email: 'daniel.wilson@example.com', status: 'Pending' },
    { name: 'Jane Anderson', address: '161 Oak Ave, Lakeside', contactNumber: '555-157-4327', email: 'jane.anderson@example.com', status: 'Pending' },
    { name: 'John Taylor', address: '720 Spruce Rd, Brookfield', contactNumber: '555-713-1026', email: 'john.taylor@example.com', status: 'Pending' },
    { name: 'Laura White', address: '847 Birch Ln, Fairview', contactNumber: '555-102-6302', email: 'laura.white@example.com', status: 'Pending' },
    { name: 'Chris Johnson', address: '462 Maple Dr, Lakeside', contactNumber: '555-963-7510', email: 'chris.johnson@example.com', status: 'Pending' },
    { name: 'Daniel Smith', address: '153 Willow Ln, Rivertown', contactNumber: '555-805-6953', email: 'daniel.smith@example.com', status: 'Pending' },
    { name: 'Jane Wilson', address: '101 Elm St, Springfield', contactNumber: '555-283-1069', email: 'jane.wilson@example.com', status: 'Pending' },
    { name: 'Michael Johnson', address: '209 Oak Ave, Hillview', contactNumber: '555-172-2744', email: 'michael.johnson@example.com', status: 'Pending' },
    { name: 'Emily Anderson', address: '674 Maple Dr, Clearwater', contactNumber: '555-561-9228', email: 'emily.anderson@example.com', status: 'Pending' },
    { name: 'Chris Wilson', address: '889 Willow Ln, Springfield', contactNumber: '555-657-1440', email: 'chris.wilson@example.com', status: 'Pending' },
    { name: 'Laura Jackson', address: '304 Main St, Fairview', contactNumber: '555-452-8172', email: 'laura.jackson@example.com', status: 'Pending' },
    { name: 'John Jackson', address: '642 Cedar St, Springfield', contactNumber: '555-619-8247', email: 'john.jackson@example.com', status: 'Pending' },
    { name: 'Sarah Taylor', address: '117 Maple Dr, Rosewood', contactNumber: '555-276-4134', email: 'sarah.taylor@example.com', status: 'Pending' },
    { name: 'Michael White', address: '776 Willow Ln, Rivertown', contactNumber: '555-780-6721', email: 'michael.white@example.com', status: 'Pending' },
    { name: 'Emily Jackson', address: '940 Elm St, Hillview', contactNumber: '555-329-1920', email: 'emily.jackson@example.com', status: 'Pending' },
    { name: 'Jane Brown', address: '341 Oak Ave, Brookfield', contactNumber: '555-584-5805', email: 'jane.brown@example.com', status: 'Pending' },
    { name: 'Olivia White', address: '874 Maple Dr, Clearview', contactNumber: '555-284-5370', email: 'olivia.white@example.com', status: 'Pending' },
    { name: 'Chris Anderson', address: '617 Birch Ln, Rosewood', contactNumber: '555-915-2058', email: 'chris.anderson@example.com', status: 'Pending' },
    { name: 'Laura Brown', address: '523 Pine Rd, Hillview', contactNumber: '555-707-8702', email: 'laura.brown@example.com', status: 'Pending' },
    { name: 'Daniel Taylor', address: '456 Spruce Rd, Brookfield', contactNumber: '555-630-7139', email: 'daniel.taylor@example.com', status: 'Pending' },
    { name: 'Sarah Johnson', address: '642 Cedar St, Rosewood', contactNumber: '555-815-4183', email: 'sarah.johnson@example.com', status: 'Pending' },
    { name: 'David Thomas', address: '820 Oak Ave, Fairview', contactNumber: '555-391-4720', email: 'david.thomas@example.com', status: 'Pending' },
    { name: 'Jane Jackson', address: '324 Elm St, Hillview', contactNumber: '555-738-1076', email: 'jane.jackson@example.com', status: 'Pending' },
    { name: 'Michael Anderson', address: '408 Willow Ln, Springfield', contactNumber: '555-327-2389', email: 'michael.anderson@example.com', status: 'Pending' },
    { name: 'Sarah White', address: '561 Maple Dr, Rivertown', contactNumber: '555-461-7365', email: 'sarah.white@example.com', status: 'Pending' },
    { name: 'David Jackson', address: '994 Oak Ave, Fairview', contactNumber: '555-954-2985', email: 'david.jackson@example.com', status: 'Pending' },
    { name: 'Emily Thomas', address: '122 Cedar St, Clearwater', contactNumber: '555-298-7692', email: 'emily.thomas@example.com', status: 'Pending' },
    { name: 'Chris Brown', address: '561 Birch Ln, Rosewood', contactNumber: '555-951-1672', email: 'chris.brown@example.com', status: 'Pending' },
    { name: 'Daniel Jackson', address: '243 Spruce Rd, Springfield', contactNumber: '555-774-8093', email: 'daniel.jackson@example.com', status: 'Pending' },
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
    if (window.confirm(`Are you sure you want to approve ${member.name}?`)) {
      setLoadingIndex(index);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const updatedMembers = [...members];
        const memberIndex = members.findIndex(
          (m) => m.name === member.name && m.email === member.email
        );
        updatedMembers[memberIndex].status = 'Approved';
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
    if (window.confirm(`Are you sure you want to reject ${member.name}?`)) {
      setLoadingIndex(index);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const updatedMembers = [...members];
        const memberIndex = members.findIndex(
          (m) => m.name === member.name && m.email === member.email
        );
        updatedMembers[memberIndex].status = 'Rejected';
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
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
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
              {paginatedMembers.length > 0 ? (
                paginatedMembers.map((member, index) => (
                  <tr key={index} className={`status-${member.status.toLowerCase().replace(' ', '-')}`}>
                    <td>{member.name}</td>
                    <td>{member.address}</td>
                    <td>{member.contactNumber}</td>
                    <td>{member.email}</td>
                    <td>{member.status}</td>
                    <td>
                      {member.status === 'Pending' ? (
                        <>
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
                        </>
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
        {renderPagination()}
      </div>
    </div>
  );
}

export default PendingMembers;