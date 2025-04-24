import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Modal from './Modal';
import '../Dashboard.css';

function Members() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [suspendIndex, setSuspendIndex] = useState(null);
  const [suspendDuration, setSuspendDuration] = useState({ days: '', hours: '', minutes: '' });
  const [timers, setTimers] = useState({});

  // Initialize members from localStorage or use default data
  const [members, setMembers] = useState(() => {
    const savedMembers = localStorage.getItem('members');
    return savedMembers
      ? JSON.parse(savedMembers)
      : [
          {
            name: 'John Doe',
            address: '123 Main St, Springfield',
            contactNumber: '555-123-4567',
            email: 'john.doe@example.com',
            status: 'Active',
            suspensionStart: null,
            suspensionDuration: null,
          },
          {
            name: 'Jane Smith',
            address: '456 Oak Ave, Rivertown',
            contactNumber: '555-987-6543',
            email: 'jane.smith@example.com',
            status: 'Active',
            suspensionStart: null,
            suspensionDuration: null,
          },
          {
            name: 'Michael Brown',
            address: '789 Pine Rd, Lakeside',
            contactNumber: '555-456-7890',
            email: 'michael.brown@example.com',
            status: 'Active',
            suspensionStart: null,
            suspensionDuration: null,
          },
          {
            name: 'Emily Johnson',
            address: '101 Maple Dr, Hillview',
            contactNumber: '555-321-6549',
            email: 'emily.johnson@example.com',
            status: 'Active',
            suspensionStart: null,
            suspensionDuration: null,
          },
          {
            name: 'David Wilson',
            address: '202 Birch Ln, Sunnyvale',
            contactNumber: '555-654-3210',
            email: 'david.wilson@example.com',
            status: 'Active',
            suspensionStart: null,
            suspensionDuration: null,
          },
        ];
  });

  // Save members to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('members', JSON.stringify(members));
  }, [members]);

  // Check for expired suspensions on mount and schedule reactivations
  useEffect(() => {
    const now = new Date().getTime();
    members.forEach((member, index) => {
      if (
        member.status === 'Suspended' &&
        member.suspensionStart &&
        member.suspensionDuration
      ) {
        const { days = 0, hours = 0, minutes = 0 } = member.suspensionDuration;
        const durationMs =
          days * 24 * 60 * 60 * 1000 +
          hours * 60 * 60 * 1000 +
          minutes * 60 * 1000;
        const suspensionEnd = member.suspensionStart + durationMs;
        if (now >= suspensionEnd) {
          // Suspension has expired
          const updatedMembers = [...members];
          updatedMembers[index].status = 'Active';
          updatedMembers[index].suspensionStart = null;
          updatedMembers[index].suspensionDuration = null;
          setMembers(updatedMembers);
        } else {
          // Schedule reactivation
          const timeLeft = suspensionEnd - now;
          const timer = setTimeout(() => {
            const updatedMembers = [...members];
            updatedMembers[index].status = 'Active';
            updatedMembers[index].suspensionStart = null;
            updatedMembers[index].suspensionDuration = null;
            setMembers(updatedMembers);
            setTimers((prev) => {
              const newTimers = { ...prev };
              delete newTimers[index];
              return newTimers;
            });
          }, timeLeft);
          setTimers((prev) => ({ ...prev, [index]: timer }));
        }
      }
    });

    // Cleanup timers on unmount
    return () => {
      Object.values(timers).forEach((timer) => clearTimeout(timer));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members]);

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

  const openSuspendModal = (index) => {
    setSuspendIndex(index);
    setSuspendDuration({ days: '', hours: '', minutes: '' });
    setIsSuspendModalOpen(true);
  };

  const closeSuspendModal = () => {
    setIsSuspendModalOpen(false);
    setSuspendIndex(null);
    setSuspendDuration({ days: '', hours: '', minutes: '' });
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

    const index = suspendIndex;
    const member = sortedMembers[index];
    setLoadingIndex(index);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const updatedMembers = [...members];
      const memberIndex = members.findIndex(
        (m) => m.name === member.name && m.email === member.email
      );
      updatedMembers[memberIndex].status = 'Suspended';
      updatedMembers[memberIndex].suspensionStart = new Date().getTime();
      updatedMembers[memberIndex].suspensionDuration = {
        days: parsedDays,
        hours: parsedHours,
        minutes: parsedMinutes,
      };
      setMembers(updatedMembers);

      // Schedule automatic reactivation
      const durationMs =
        parsedDays * 24 * 60 * 60 * 1000 +
        parsedHours * 60 * 60 * 1000 +
        parsedMinutes * 60 * 1000;
      const timer = setTimeout(() => {
        const updatedMembers = [...members];
        updatedMembers[memberIndex].status = 'Active';
        updatedMembers[memberIndex].suspensionStart = null;
        updatedMembers[memberIndex].suspensionDuration = null;
        setMembers(updatedMembers);
        setTimers((prev) => {
          const newTimers = { ...prev };
          delete newTimers[memberIndex];
          return newTimers;
        });
      }, durationMs);
      setTimers((prev) => ({ ...prev, [memberIndex]: timer }));

      closeSuspendModal();
    } catch (error) {
      console.error('Error suspending member:', error);
      alert('Failed to suspend member. Please try again.');
    } finally {
      setLoadingIndex(null);
    }
  };

  const handleRevoke = async (index) => {
    const member = sortedMembers[index];
    if (window.confirm(`Are you sure you want to revoke ${member.name}'s membership?`)) {
      setLoadingIndex(index);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const updatedMembers = [...members];
        const memberIndex = members.findIndex(
          (m) => m.name === member.name && m.email === member.email
        );
        updatedMembers[memberIndex].status = 'Revoked';
        updatedMembers[memberIndex].suspensionStart = null;
        updatedMembers[memberIndex].suspensionDuration = null;
        setMembers(updatedMembers);

        // Clear any existing timer
        if (timers[memberIndex]) {
          clearTimeout(timers[memberIndex]);
          setTimers((prev) => {
            const newTimers = { ...prev };
            delete newTimers[memberIndex];
            return newTimers;
          });
        }
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
    if (window.confirm(`Are you sure you want to reactivate ${member.name}?`)) {
      setLoadingIndex(index);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const updatedMembers = [...members];
        const memberIndex = members.findIndex(
          (m) => m.name === member.name && m.email === member.email
        );
        updatedMembers[memberIndex].status = 'Active';
        updatedMembers[memberIndex].suspensionStart = null;
        updatedMembers[memberIndex].suspensionDuration = null;
        setMembers(updatedMembers);

        // Clear any existing timer
        if (timers[memberIndex]) {
          clearTimeout(timers[memberIndex]);
          setTimers((prev) => {
            const newTimers = { ...prev };
            delete newTimers[memberIndex];
            return newTimers;
          });
        }
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
                  <tr key={index} className={`status-${member.status.toLowerCase()}`}>
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
                            onClick={() => openSuspendModal(index)}
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

      {/* Suspend Duration Modal */}
      <Modal
        isOpen={isSuspendModalOpen}
        onClose={closeSuspendModal}
        title="Suspend Member"
      >
        <p>
          Enter the suspension duration for {suspendIndex !== null && sortedMembers[suspendIndex]?.name}.
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
    </div>
  );
}

export default Members;