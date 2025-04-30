import React, { useState, useEffect, useMemo, useRef, memo } from 'react';
import * as XLSX from 'xlsx';
import Sidebar from './Sidebar';
import Modal from './Modal';
import '../Dashboard.css';

// Custom debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Memoized CustomerRow component
const CustomerRow = memo(({ customer, index, loadingIndex, openSuspendModal, openRevokeModal, handleReactivate, openViewModal }) => {
  return (
    <tr className={`status-${customer.status.toLowerCase()}`}>
      <td>{customer.name}</td>
      <td>{customer.address}</td>
      <td>{customer.contactNumber}</td>
      <td>{customer.email}</td>
      <td>{customer.status}</td>
      <td>{customer.suspensionReason || customer.revokeReason || '-'}</td>
      <td>
        {customer.status === 'Active' && (
          <>
            <button
              className="action-btn suspend"
              onClick={() => openSuspendModal(index)}
              disabled={loadingIndex === index}
              aria-label={`Suspend ${customer.name}`}
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
              onClick={() => openRevokeModal(index)}
              disabled={loadingIndex === index}
              aria-label={`Revoke ${customer.name}`}
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
        )}
        {customer.status === 'Suspended' && (
          <button
            className="action-btn reactivate"
            onClick={() => handleReactivate(index)}
            disabled={loadingIndex === index}
            aria-label={`Reactivate ${customer.name}`}
          >
            {loadingIndex === index ? (
              <span>
                <span className="spinner"></span> Reactivating...
              </span>
            ) : (
              'Reactivate'
            )}
          </button>
        )}
        <button
          className="action-btn view"
          onClick={() => openViewModal(index)}
          disabled={loadingIndex === index}
          aria-label={`View details for ${customer.name}`}
        >
          View
        </button>
      </td>
    </tr>
  );
});

function Customers() {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchTerm = useDebounce(searchInput, 150);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [suspendIndex, setSuspendIndex] = useState(null);
  const [suspendDuration, setSuspendDuration] = useState({ days: '', hours: '', minutes: '' });
  const [suspendReason, setSuspendReason] = useState('');
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [revokeIndex, setRevokeIndex] = useState(null);
  const [revokeReason, setRevokeReason] = useState('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewIndex, setViewIndex] = useState(null);
  const timerRef = useRef({});
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const defaultCustomers = Array.from({ length: 1000 }, (_, i) => ({
    userId: i + 1,
    name: `Customer ${i + 1}`,
    address: `${100 + i} Example St, City ${i + 1}`,
    contactNumber: `555-${100 + i}-${String(i).padStart(4, '0')}`,
    email: `customer${i}@example.com`,
    status: "Active",
    suspensionStart: null,
    suspensionDuration: null,
    suspensionReason: null,
    revokeReason: null,
  }));

  const [customers, setCustomers] = useState(defaultCustomers);

  useEffect(() => {
    const now = new Date().getTime();
    customers.forEach((customer, index) => {
      if (
        customer.status === 'Suspended' &&
        customer.suspensionStart &&
        customer.suspensionDuration
      ) {
        const { days = 0, hours = 0, minutes = 0 } = customer.suspensionDuration;
        const durationMs =
          days * 24 * 60 * 60 * 1000 +
          hours * 60 * 60 * 1000 +
          minutes * 60 * 1000;
        const suspensionEnd = customer.suspensionStart + durationMs;
        if (now >= suspensionEnd) {
          const updatedCustomers = [...customers];
          updatedCustomers[index].status = 'Active';
          updatedCustomers[index].suspensionStart = null;
          updatedCustomers[index].suspensionDuration = null;
          updatedCustomers[index].suspensionReason = null;
          updatedCustomers[index].revokeReason = null;
          setCustomers(updatedCustomers);
        } else {
          const timeLeft = suspensionEnd - now;
          const timer = setTimeout(() => {
            const updatedCustomers = [...customers];
            updatedCustomers[index].status = 'Active';
            updatedCustomers[index].suspensionStart = null;
            updatedCustomers[index].suspensionDuration = null;
            updatedCustomers[index].suspensionReason = null;
            updatedCustomers[index].revokeReason = null;
            setCustomers(updatedCustomers);
            delete timerRef.current[index];
          }, timeLeft);
          timerRef.current[index] = timer;
        }
      }
    });

    return () => {
      Object.values(timerRef.current).forEach((timer) => clearTimeout(timer));
      timerRef.current = {};
    };
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    if (!debouncedSearchTerm && statusFilter === 'All') {
      return customers;
    }

    const lowerSearchTerm = debouncedSearchTerm.toLowerCase();
    return customers.filter((customer) => {
      if (statusFilter !== 'All' && customer.status !== statusFilter) {
        return false;
      }

      const searchString = [
        customer.userId.toString(),
        customer.name,
        customer.email,
        customer.address,
        customer.contactNumber,
        customer.status,
        customer.suspensionReason || '',
        customer.revokeReason || '',
      ]
        .join(' ')
        .toLowerCase();

      return searchString.includes(lowerSearchTerm);
    });
  }, [customers, statusFilter, debouncedSearchTerm]);

  const sortedCustomers = useMemo(() => {
    return [...filteredCustomers].sort((a, b) => {
      const key = sortConfig.key;
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      const aValue = a[key] || '';
      const bValue = b[key] || '';
      if (aValue < bValue) return -direction;
      if (aValue > bValue) return direction;
      return 0;
    });
  }, [filteredCustomers, sortConfig]);

  const totalPages = Math.ceil(sortedCustomers.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedCustomers = sortedCustomers.slice(startIndex, startIndex + recordsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    console.log('Customers:', customers.length);
    console.log('Filtered customers:', filteredCustomers.length);
    console.log('Sorted customers:', sortedCustomers.length);
    console.log('Paginated customers:', paginatedCustomers.length);
    console.log('Current page:', currentPage, 'Records per page:', recordsPerPage);
  }, [customers, filteredCustomers, sortedCustomers, paginatedCustomers, currentPage, recordsPerPage]);

  const sortData = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const openSuspendModal = (index) => {
    setSuspendIndex(index);
    setSuspendDuration({ days: '', hours: '', minutes: '' });
    setSuspendReason('');
    setIsSuspendModalOpen(true);
  };

  const closeSuspendModal = () => {
    setIsSuspendModalOpen(false);
    setSuspendIndex(null);
    setSuspendDuration({ days: '', hours: '', minutes: '' });
    setSuspendReason('');
  };

  const openRevokeModal = (index) => {
    setRevokeIndex(index);
    setRevokeReason('');
    setIsRevokeModalOpen(true);
  };

  const closeRevokeModal = () => {
    setIsRevokeModalOpen(false);
    setRevokeIndex(null);
    setRevokeReason('');
  };

  const openViewModal = (index) => {
    setViewIndex(index);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewIndex(null);
  };

  const handleSuspend = async () => {
    const { days = 0, hours = 0, minutes = 0 } = suspendDuration;
    const parsedDays = parseInt(days) || 0;
    const parsedHours = parseInt(hours) || 0;
    const parsedMinutes = parseInt(minutes) || 0;

    if (parsedDays === 0 && parsedHours === 0 && parsedMinutes === 0) {
      alert('Please enter a valid suspension duration (at least one field must be non-zero).');
      return;
    }

    if (parsedDays < 0 || parsedHours < 0 || parsedMinutes < 0) {
      alert('Suspension duration cannot be negative.');
      return;
    }

    if (!suspendReason || suspendReason === '') {
      alert('Please select a reason for the suspension.');
      return;
    }

    const index = suspendIndex;
    const customer = paginatedCustomers[index];
    setLoadingIndex(index);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const updatedCustomers = [...customers];
      const customerIndex = customers.findIndex(
        (c) => c.userId === customer.userId
      );
      updatedCustomers[customerIndex].status = 'Suspended';
      updatedCustomers[customerIndex].suspensionStart = new Date().getTime();
      updatedCustomers[customerIndex].suspensionDuration = {
        days: parsedDays,
        hours: parsedHours,
        minutes: parsedMinutes,
      };
      updatedCustomers[customerIndex].suspensionReason = suspendReason;
      updatedCustomers[customerIndex].revokeReason = null;
      setCustomers(updatedCustomers);

      const durationMs =
        parsedDays * 24 * 60 * 60 * 1000 +
        parsedHours * 60 * 60 * 1000 +
        parsedMinutes * 60 * 1000;
      const timer = setTimeout(() => {
        const updatedCustomers = [...customers];
        updatedCustomers[customerIndex].status = 'Active';
        updatedCustomers[customerIndex].suspensionStart = null;
        updatedCustomers[customerIndex].suspensionDuration = null;
        updatedCustomers[customerIndex].suspensionReason = null;
        updatedCustomers[customerIndex].revokeReason = null;
        setCustomers(updatedCustomers);
        delete timerRef.current[customerIndex];
      }, durationMs);
      timerRef.current[customerIndex] = timer;

      closeSuspendModal();
    } catch (error) {
      console.error('Error suspending customer:', error);
      alert('Failed to suspend customer. Please try again.');
    } finally {
      setLoadingIndex(null);
    }
  };

  const handleRevoke = async () => {
    if (!revokeReason || revokeReason === '') {
      alert('Please select a reason for the revocation.');
      return;
    }

    const index = revokeIndex;
    const customer = paginatedCustomers[index];
    setLoadingIndex(index);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const updatedCustomers = [...customers];
      const customerIndex = customers.findIndex(
        (c) => c.userId === customer.userId
      );
      updatedCustomers[customerIndex].status = 'Revoked';
      updatedCustomers[customerIndex].suspensionStart = null;
      updatedCustomers[customerIndex].suspensionDuration = null;
      updatedCustomers[customerIndex].suspensionReason = null;
      updatedCustomers[customerIndex].revokeReason = revokeReason;
      setCustomers(updatedCustomers);

      if (timerRef.current[customerIndex]) {
        clearTimeout(timerRef.current[customerIndex]);
        delete timerRef.current[customerIndex];
      }

      closeRevokeModal();
    } catch (error) {
      console.error('Error revoking customer:', error);
      alert('Failed to revoke customer. Please try again.');
    } finally {
      setLoadingIndex(null);
    }
  };

  const handleReactivate = async (index) => {
    const customer = paginatedCustomers[index];
    if (window.confirm(`Are you sure you want to reactivate ${customer.name}?`)) {
      setLoadingIndex(index);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const updatedCustomers = [...customers];
        const customerIndex = customers.findIndex(
          (c) => c.userId === customer.userId
        );
        updatedCustomers[customerIndex].status = 'Active';
        updatedCustomers[customerIndex].suspensionStart = null;
        updatedCustomers[customerIndex].suspensionDuration = null;
        updatedCustomers[customerIndex].suspensionReason = null;
        updatedCustomers[customerIndex].revokeReason = null;
        setCustomers(updatedCustomers);

        if (timerRef.current[customerIndex]) {
          clearTimeout(timerRef.current[customerIndex]);
          delete timerRef.current[customerIndex];
        }
      } catch (error) {
        console.error('Error reactivating customer:', error);
        alert('Failed to reactivate customer. Please try again.');
      } finally {
        setLoadingIndex(null);
      }
    }
  };

  const handleRecordsPerPageChange = (e) => {
    const value = e.target.value === '100' ? 100 : Number(e.target.value);
    setRecordsPerPage(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      sortedCustomers.map((customer) => ({
        'User ID': customer.userId,
        Name: customer.name,
        Address: customer.address,
        'Contact Number': customer.contactNumber,
        Email: customer.email,
        Status: customer.status,
        'Suspension Start': customer.suspensionStart ? new Date(customer.suspensionStart).toLocaleString() : '-',
        'Suspension Duration': customer.suspensionDuration ? `${customer.suspensionDuration.days} days, ${customer.suspensionDuration.hours} hours, ${customer.suspensionDuration.minutes} minutes` : '-',
        'Suspension Reason': customer.suspensionReason || '-',
        'Revoke Reason': customer.revokeReason || '-',
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
    XLSX.writeFile(workbook, 'Customers.xlsx');
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const maxPagesToShow = 5; // Show 5 page numbers at a time (excluding first, last, and ellipsis)
    const halfPages = Math.floor(maxPagesToShow / 2);
    let startPage = Math.max(2, currentPage - halfPages);
    let endPage = Math.min(totalPages - 1, currentPage + halfPages);

    // Adjust start and end to ensure we show maxPagesToShow pages when possible
    if (endPage - startPage + 1 < maxPagesToShow) {
      if (currentPage < totalPages / 2) {
        endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);
      } else {
        startPage = Math.max(2, endPage - maxPagesToShow + 1);
      }
    }

    const pageNumbers = [];

    // Always show first page
    pageNumbers.push(1);

    // Add ellipsis if there's a gap between page 1 and startPage
    if (startPage > 2) {
      pageNumbers.push('...');
    }

    // Add pages between startPage and endPage
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Add ellipsis if there's a gap between endPage and last page
    if (endPage < totalPages - 1) {
      pageNumbers.push('...');
    }

    // Always show last page if totalPages > 1
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return (
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {pageNumbers.map((page, index) => (
          <span key={index}>
            {page === '...' ? (
              <span className="ellipsis">...</span>
            ) : (
              <button
                onClick={() => handlePageChange(page)}
                className={currentPage === page ? 'active' : ''}
              >
                {page}
              </button>
            )}
          </span>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <span>
          Page {currentPage} of {totalPages} | Total Customers: {sortedCustomers.length}
        </span>
      </div>
    );
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleString();
  };

  const formatDuration = (duration) => {
    if (!duration) return '-';
    const { days = 0, hours = 0, minutes = 0 } = duration;
    return `${days} days, ${hours} hours, ${minutes} minutes`;
  };

  const suspensionReasons = [
    { value: '', label: 'Select a reason', disabled: true },
    { value: 'Policy Violation', label: 'Policy Violation' },
    { value: 'Failure to Pay', label: 'Failure to Pay' },
    { value: 'Breach of Contract', label: 'Breach of Contract' },
    { value: 'Inappropriate Behavior', label: 'Inappropriate Behavior' },
    { value: 'Fraudulent Activity', label: 'Fraudulent Activity' },
    { value: 'Other', label: 'Other' },
  ];

  const revokeReasons = [
    { value: '', label: 'Select a reason', disabled: true },
    { value: 'Policy Violation', label: 'Policy Violation' },
    { value: 'Failure to Pay', label: 'Failure to Pay' },
    { value: 'Breach of Contract', label: 'Breach of Contract' },
    { value: 'Inappropriate Behavior', label: 'Inappropriate Behavior' },
    { value: 'Fraudulent Activity', label: 'Fraudulent Activity' },
    { value: 'Other', label: 'Other' },
  ];

  return (
    <div className="dashboard">
      <Sidebar activePage="Customers" />
      <div className="main-content">
        <h1>CUSTOMERS</h1>
        <div className="search-bar">
          <button className="action-btn excel" onClick={exportToExcel}>
            Export to Excel
          </button>
          <select
            value={recordsPerPage}
            onChange={handleRecordsPerPageChange}
            className="records-per-page"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
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
            placeholder="Search by name, email, address..."
            value={searchInput}
            onChange={handleSearchChange}
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
                <th>Reason</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.length > 0 ? (
                paginatedCustomers.map((customer, index) => (
                  <CustomerRow
                    key={customer.userId}
                    customer={customer}
                    index={index}
                    loadingIndex={loadingIndex}
                    openSuspendModal={openSuspendModal}
                    openRevokeModal={openRevokeModal}
                    handleReactivate={handleReactivate}
                    openViewModal={openViewModal}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>
                    No matching customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {renderPagination()}
      </div>

      <Modal
        isOpen={isSuspendModalOpen}
        onClose={closeSuspendModal}
        title="Suspend Customer"
      >
        <p>
          Enter the suspension duration and reason for {suspendIndex !== null && paginatedCustomers[suspendIndex]?.name}.
        </p>
        <div className="modal-form">
          <div className="duration-inputs">
            <label>
              Days:
              <input
                type="number"
                value={suspendDuration.days}
                onChange={(e) =>
                  setSuspendDuration({ ...suspendDuration, days: e.target.value })
                }
                min="0"
                placeholder="0"
                disabled={loadingIndex !== null}
              />
            </label>
            <label>
              Hours:
              <input
                type="number"
                value={suspendDuration.hours}
                onChange={(e) =>
                  setSuspendDuration({ ...suspendDuration, hours: e.target.value })
                }
                min="0"
                placeholder="0"
                disabled={loadingIndex !== null}
              />
            </label>
            <label>
              Minutes:
              <input
                type="number"
                value={suspendDuration.minutes}
                onChange={(e) =>
                  setSuspendDuration({ ...suspendDuration, minutes: e.target.value })
                }
                min="0"
                placeholder="0"
                disabled={loadingIndex !== null}
              />
            </label>
          </div>
          <div className="reason-input">
            <label>
              Reason for Suspension:
              <select
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                disabled={loadingIndex !== null}
              >
                {suspensionReasons.map((reason) => (
                  <option
                    key={reason.value}
                    value={reason.value}
                    disabled={reason.disabled}
                  >
                    {reason.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="modal-footer">
            <button
              className="btn-cancel"
              onClick={closeSuspendModal}
              disabled={loadingIndex !== null}
            >
              Cancel
            </button>
            <button
              className="btn-confirm"
              onClick={handleSuspend}
              disabled={loadingIndex !== null}
            >
              {loadingIndex !== null ? 'Suspending...' : 'Confirm Suspension'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isRevokeModalOpen}
        onClose={closeRevokeModal}
        title="Revoke Customer"
      >
        <p>
          Select the reason for revoking {revokeIndex !== null && paginatedCustomers[revokeIndex]?.name}'s account.
        </p>
        <div className="modal-form">
          <div className="reason-input">
            <label>
              Reason for Revocation:
              <select
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                disabled={loadingIndex !== null}
              >
                {revokeReasons.map((reason) => (
                  <option
                    key={reason.value}
                    value={reason.value}
                    disabled={reason.disabled}
                  >
                    {reason.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="modal-footer">
            <button
              className="btn-cancel"
              onClick={closeRevokeModal}
              disabled={loadingIndex !== null}
            >
              Cancel
            </button>
            <button
              className="btn-confirm"
              onClick={handleRevoke}
              disabled={loadingIndex !== null}
            >
              {loadingIndex !== null ? 'Revoking...' : 'Confirm Revocation'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={closeViewModal}
        title="Customer Details"
      >
        {viewIndex !== null && paginatedCustomers[viewIndex] ? (
          <div className="view-details">
            <p><strong>User ID:</strong> {paginatedCustomers[viewIndex].userId}</p>
            <p><strong>Name:</strong> {paginatedCustomers[viewIndex].name}</p>
            <p><strong>Address:</strong> {paginatedCustomers[viewIndex].address}</p>
            <p><strong>Contact Number:</strong> {paginatedCustomers[viewIndex].contactNumber}</p>
            <p><strong>Email:</strong> {paginatedCustomers[viewIndex].email}</p>
            <p><strong>Status:</strong> {paginatedCustomers[viewIndex].status}</p>
            {paginatedCustomers[viewIndex].status === 'Suspended' ? (
              <>
                <p><strong>Suspension Start:</strong> {formatDate(paginatedCustomers[viewIndex].suspensionStart)}</p>
                <p><strong>Suspension Duration:</strong> {formatDuration(paginatedCustomers[viewIndex].suspensionDuration)}</p>
                <p><strong>Suspension Reason:</strong> {paginatedCustomers[viewIndex].suspensionReason || '-'}</p>
              </>
            ) : paginatedCustomers[viewIndex].status === 'Revoked' ? (
              <p><strong>Revoke Reason:</strong> {paginatedCustomers[viewIndex].revokeReason || '-'}</p>
            ) : null}
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeViewModal}>
                Close
              </button>
            </div>
          </div>
        ) : (
          <p>No customer data available.</p>
        )}
      </Modal>
    </div>
  );
}

export default Customers;