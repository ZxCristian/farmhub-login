import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  const [suspendReason, setSuspendReason] = useState('');
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [revokeIndex, setRevokeIndex] = useState(null);
  const [revokeReason, setRevokeReason] = useState('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewIndex, setViewIndex] = useState(null);
  const [timers, setTimers] = useState({});
  const [recordsPerPage, setRecordsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  const defaultMembers = [
    { userId: 1, name: "John Doe", address: "100 Main St, Springfield", contactNumber: "555-100-0100", email: "john.doe0@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 2, name: "Jane Smith", address: "101 Oak Ave, Rivertown", contactNumber: "555-101-0101", email: "jane.smith1@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 3, name: "Michael Brown", address: "102 Pine Rd, Lakeside", contactNumber: "555-102-0102", email: "michael.brown2@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 4, name: "Emily Johnson", address: "103 Maple Dr, Hillview", contactNumber: "555-103-0103", email: "emily.johnson3@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 5, name: "David Wilson", address: "104 Birch Ln, Sunnyvale", contactNumber: "555-104-0104", email: "david.wilson4@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 6, name: "Sophia Clark", address: "105 Elm St, Brookfield", contactNumber: "555-105-0105", email: "sophia.clark5@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 7, name: "Liam Taylor", address: "106 Cedar St, Oakville", contactNumber: "555-106-0106", email: "liam.taylor6@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 8, name: "Olivia Harris", address: "107 Walnut St, Riverbend", contactNumber: "555-107-0107", email: "olivia.harris7@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 9, name: "Noah White", address: "108 Chestnut Ave, Greenwood", contactNumber: "555-108-0108", email: "noah.white8@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 10, name: "Ava Martin", address: "109 Aspen Rd, Silverlake", contactNumber: "555-109-0109", email: "ava.martin9@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 11, name: "James Thompson", address: "110 Redwood Dr, Pinehill", contactNumber: "555-110-0110", email: "james.thompson10@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 12, name: "Isabella Scott", address: "111 Spruce St, Fairview", contactNumber: "555-111-0111", email: "isabella.scott11@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 13, name: "Benjamin Hall", address: "112 Sycamore St, Forestville", contactNumber: "555-112-0112", email: "benjamin.hall12@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 14, name: "Mia Adams", address: "113 Poplar Ave, Hillcrest", contactNumber: "555-113-0113", email: "mia.adams13@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 15, name: "Lucas Baker", address: "114 Willow Dr, Riverstone", contactNumber: "555-114-0114", email: "lucas.baker14@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 16, name: "Charlotte Nelson", address: "115 Fir Ln, Lakeview", contactNumber: "555-115-0115", email: "charlotte.nelson15@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 17, name: "Henry Campbell", address: "116 Beech St, Glenwood", contactNumber: "555-116-0116", email: "henry.campbell16@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 18, name: "Amelia Edwards", address: "117 Alder Rd, Meadowbrook", contactNumber: "555-117-0117", email: "amelia.edwards17@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 19, name: "Alexander Rivera", address: "118 Hickory St, Greenfield", contactNumber: "555-118-0118", email: "alex.rivera18@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 20, name: "Evelyn Turner", address: "119 Dogwood Ln, Hilldale", contactNumber: "555-119-0119", email: "evelyn.turner19@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 21, name: "Daniel Cox", address: "120 Magnolia Ave, Stonebridge", contactNumber: "555-120-0120", email: "daniel.cox20@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 22, name: "Harper Ward", address: "121 Locust Rd, Maplewood", contactNumber: "555-121-0121", email: "harper.ward21@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 23, name: "Sebastian Perez", address: "122 Laurel St, Rosewood", contactNumber: "555-122-0122", email: "sebastian.perez22@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 24, name: "Ella Brooks", address: "123 Palm Ave, Creekside", contactNumber: "555-123-0123", email: "ella.brooks23@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 25, name: "Jack Bennett", address: "124 Cypress Rd, Cedarhill", contactNumber: "555-124-0124", email: "jack.bennett24@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 26, name: "Scarlett Gray", address: "125 Sequoia Dr, Birchwood", contactNumber: "555-125-0125", email: "scarlett.gray25@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 27, name: "William Morris", address: "126 Maple St, Westfield", contactNumber: "555-126-0126", email: "william.morris26@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 28, name: "Aria Rogers", address: "127 Palm Dr, Eastview", contactNumber: "555-127-0127", email: "aria.rogers27@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 29, name: "Logan Cooper", address: "128 Cedar Ave, Oakridge", contactNumber: "555-128-0128", email: "logan.cooper28@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 30, name: "Grace Bailey", address: "129 Pine Ln, Meadowlark", contactNumber: "555-129-0129", email: "grace.bailey29@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 31, name: "Jacob Murphy", address: "130 Ash Rd, Foresthill", contactNumber: "555-130-0130", email: "jacob.murphy30@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 32, name: "Chloe Bell", address: "131 Cherry Dr, Bayview", contactNumber: "555-131-0131", email: "chloe.bell31@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 33, name: "Levi Russell", address: "132 Oak Ln, Greenridge", contactNumber: "555-132-0132", email: "levi.russell32@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 34, name: "Luna Griffin", address: "133 Poplar Rd, Hillbrook", contactNumber: "555-133-0133", email: "luna.griffin33@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 35, name: "Matthew Foster", address: "134 Walnut Dr, Rivergrove", contactNumber: "555-134-0134", email: "matthew.foster34@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 36, name: "Avery Simmons", address: "135 Elm Ln, Cedarpark", contactNumber: "555-135-0135", email: "avery.simmons35@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 37, name: "Ethan Hayes", address: "136 Pine Ave, Sunnyhill", contactNumber: "555-136-0136", email: "ethan.hayes36@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 38, name: "Sofia Price", address: "137 Spruce Rd, Maplepark", contactNumber: "555-137-0137", email: "sofia.price37@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 39, name: "Jackson Butler", address: "138 Beech St, Lakepark", contactNumber: "555-138-0138", email: "jackson.butler38@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 40, name: "Aiden Patterson", address: "140 Fir Rd, Springbrook", contactNumber: "555-140-0140", email: "aiden.patterson40@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 41, name: "Zoe Barnes", address: "141 Sycamore Dr, Evergreen", contactNumber: "555-141-0141", email: "zoe.barnes41@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 42, name: "Caleb Powell", address: "142 Locust Ln, Riverdale", contactNumber: "555-142-0142", email: "caleb.powell42@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 43, name: "Layla Ross", address: "143 Laurel Rd, Woodside", contactNumber: "555-143-0143", email: "layla.ross43@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 44, name: "Nathan James", address: "144 Hickory Ave, Brookside", contactNumber: "555-144-0144", email: "nathan.james44@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 45, name: "Victoria Reed", address: "145 Magnolia Ln, Timberlake", contactNumber: "555-145-0145", email: "victoria.reed45@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 46, name: "Ryan Cook", address: "146 Cherry St, Fairbrook", contactNumber: "555-146-0146", email: "ryan.cook46@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 47, name: "Hannah Morgan", address: "147 Dogwood Rd, Redwood", contactNumber: "555-147-0147", email: "hannah.morgan47@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 48, name: "Samuel Bailey", address: "148 Chestnut Dr, Oakmeadow", contactNumber: "555-148-0148", email: "samuel.bailey48@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 49, name: "Abigail Diaz", address: "149 Palm Ln, Springhill", contactNumber: "555-149-0149", email: "abigail.diaz49@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
  ];

  const [members, setMembers] = useState(() => {
    const savedMembers = localStorage.getItem('members');
    try {
      if (savedMembers) {
        const parsedMembers = JSON.parse(savedMembers);
        // Ensure all members have a unique userId
        const usedIds = new Set();
        return parsedMembers.map((member, index) => {
          let userId = member.userId !== undefined ? Number(member.userId) : index + 1;
          // Ensure uniqueness
          while (usedIds.has(userId)) {
            userId = Math.max(...usedIds) + 1;
          }
          usedIds.add(userId);
          return { ...member, userId };
        });
      }
      return defaultMembers;
    } catch (error) {
      console.error('Error parsing localStorage members:', error);
      return defaultMembers;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('members', JSON.stringify(members));
    } catch (error) {
      console.error('Error saving members to localStorage:', error);
    }
  }, [members]);

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
          const updatedMembers = [...members];
          updatedMembers[index].status = 'Active';
          updatedMembers[index].suspensionStart = null;
          updatedMembers[index].suspensionDuration = null;
          updatedMembers[index].suspensionReason = null;
          updatedMembers[index].revokeReason = null;
          setMembers(updatedMembers); // Fixed typo from set IMPACTMembers
        } else {
          const timeLeft = suspensionEnd - now;
          const timer = setTimeout(() => {
            const updatedMembers = [...members];
            updatedMembers[index].status = 'Active';
            updatedMembers[index].suspensionStart = null;
            updatedMembers[index].suspensionDuration = null;
            updatedMembers[index].suspensionReason = null;
            updatedMembers[index].revokeReason = null;
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

    return () => {
      Object.values(timers).forEach((timer) => clearTimeout(timer));
    };
  }, [members]);

  // Debounce search input
  const handleSearchChange = useCallback((value) => {
    let timeout;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setSearchTerm(value);
      }, 300);
    };
  }, []);

  const filteredMembers = useMemo(() => {
    return members.filter(
      (member) =>
        (statusFilter === 'All' || member.status === statusFilter) &&
        (member.userId.toString().includes(searchTerm) ||
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.contactNumber.includes(searchTerm) ||
          member.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (member.suspensionReason && member.suspensionReason.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (member.revokeReason && member.revokeReason.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  }, [members, statusFilter, searchTerm]);

  const sortedMembers = useMemo(() => {
    return [...filteredMembers].sort((a, b) => {
      const key = sortConfig.key;
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      const aValue = a[key] || '';
      const bValue = b[key] || '';
      if (aValue < bValue) return -direction;
      if (aValue > bValue) return direction;
      return 0;
    });
  }, [filteredMembers, sortConfig]);

  const totalPages = Math.ceil(sortedMembers.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedMembers = sortedMembers.slice(startIndex, startIndex + recordsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    console.log('Members:', members.length);
    console.log('Filtered members:', filteredMembers.length);
    console.log('Sorted members:', sortedMembers.length);
    console.log('Paginated members:', paginatedMembers.length);
    console.log('Current page:', currentPage, 'Records per page:', recordsPerPage);
  }, [members, filteredMembers, sortedMembers, paginatedMembers, currentPage, recordsPerPage]);

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
    const member = paginatedMembers[index];
    setLoadingIndex(index);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const updatedMembers = [...members];
      const memberIndex = members.findIndex(
        (m) => m.userId === member.userId
      );
      updatedMembers[memberIndex].status = 'Suspended';
      updatedMembers[memberIndex].suspensionStart = new Date().getTime();
      updatedMembers[memberIndex].suspensionDuration = {
        days: parsedDays,
        hours: parsedHours,
        minutes: parsedMinutes,
      };
      updatedMembers[memberIndex].suspensionReason = suspendReason;
      updatedMembers[memberIndex].revokeReason = null;
      setMembers(updatedMembers);

      const durationMs =
        parsedDays * 24 * 60 * 60 * 1000 +
        parsedHours * 60 * 60 * 1000 +
        parsedMinutes * 60 * 1000;
      const timer = setTimeout(() => {
        const updatedMembers = [...members];
        updatedMembers[memberIndex].status = 'Active';
        updatedMembers[memberIndex].suspensionStart = null;
        updatedMembers[memberIndex].suspensionDuration = null;
        updatedMembers[memberIndex].suspensionReason = null;
        updatedMembers[memberIndex].revokeReason = null;
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

  const handleRevoke = async () => {
    if (!revokeReason || revokeReason === '') {
      alert('Please select a reason for the revocation.');
      return;
    }

    const index = revokeIndex;
    const member = paginatedMembers[index];
    setLoadingIndex(index);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const updatedMembers = [...members];
      const memberIndex = members.findIndex(
        (m) => m.userId === member.userId
      );
      updatedMembers[memberIndex].status = 'Revoked';
      updatedMembers[memberIndex].suspensionStart = null;
      updatedMembers[memberIndex].suspensionDuration = null;
      updatedMembers[memberIndex].suspensionReason = null;
      updatedMembers[memberIndex].revokeReason = revokeReason;
      setMembers(updatedMembers);

      if (timers[memberIndex]) {
        clearTimeout(timers[memberIndex]);
        setTimers((prev) => {
          const newTimers = { ...prev };
          delete newTimers[memberIndex];
          return newTimers;
        });
      }

      closeRevokeModal();
    } catch (error) {
      console.error('Error revoking membership:', error);
      alert('Failed to revoke membership. Please try again.');
    } finally {
      setLoadingIndex(null);
    }
  };

  const handleReactivate = async (index) => {
    const member = paginatedMembers[index];
    if (window.confirm(`Are you sure you want to reactivate ${member.name}?`)) {
      setLoadingIndex(index);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const updatedMembers = [...members];
        const memberIndex = members.findIndex(
          (m) => m.userId === member.userId
        );
        updatedMembers[memberIndex].status = 'Active';
        updatedMembers[memberIndex].suspensionStart = null;
        updatedMembers[memberIndex].suspensionDuration = null;
        updatedMembers[memberIndex].suspensionReason = null;
        updatedMembers[memberIndex].revokeReason = null;
        setMembers(updatedMembers);

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

  const handleRecordsPerPageChange = (e) => {
    const value = e.target.value === '100' ? sortedMembers.length : Number(e.target.value);
    setRecordsPerPage(value);
    setCurrentPage(1);
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
    { value: 'Failure to Deliver', label: 'Failure to Deliver' },
    { value: 'Inappropriate Behavior', label: 'Inappropriate Behavior' },
    { value: 'Breach of Contract', label: 'Breach of Contract' },
    { value: 'Account Sharing', label: 'Account Sharing' },
    { value: 'Other', label: 'Other' },
  ];

  const revokeReasons = [
    { value: '', label: 'Select a reason', disabled: true },
    { value: 'Policy Violation', label: 'Policy Violation' },
    { value: 'Failure to Deliver', label: 'Failure to Deliver' },
    { value: 'Inappropriate Behavior', label: 'Inappropriate Behavior' },
    { value: 'Breach of Contract', label: 'Breach of Contract' },
    { value: 'Account Sharing', label: 'Account Sharing' },
    { value: 'Other', label: 'Other' },
  ];

  return (
    <div className="dashboard">
      <Sidebar activePage="Members" />
      <div className="main-content">
        <h1>MEMBERS</h1>
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
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Revoked">Revoked</option>
          </select>
          <input
            type="text"
            placeholder="Search by name, email, address..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)()}
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
              {paginatedMembers.length > 0 ? (
                paginatedMembers.map((member) => {
                  const memberIndex = paginatedMembers.indexOf(member);
                  return (
                    <tr key={member.userId} className={`status-${member.status.toLowerCase()}`}>
                      <td>{member.name}</td>
                      <td>{member.address}</td>
                      <td>{member.contactNumber}</td>
                      <td>{member.email}</td>
                      <td>{member.status}</td>
                      <td>{member.suspensionReason || member.revokeReason || '-'}</td>
                      <td>
                        {member.status === 'Active' && (
                          <>
                            <button
                              className="action-btn suspend"
                              onClick={() => openSuspendModal(memberIndex)}
                              disabled={loadingIndex === memberIndex}
                            >
                              {loadingIndex === memberIndex ? (
                                <span>
                                  <span className="spinner"></span> Suspending...
                                </span>
                              ) : (
                                'Suspend'
                              )}
                            </button>
                            <button
                              className="action-btn revoke"
                              onClick={() => openRevokeModal(memberIndex)}
                              disabled={loadingIndex === memberIndex}
                            >
                              {loadingIndex === memberIndex ? (
                                <span>
                                  <span className="spinner"></span> Revoking...
                                </span>
                              ) : (
                                'Revoke'
                              )}
                            </button>
                          </>
                        )}
                        {member.status === 'Suspended' && (
                          <button
                            className="action-btn reactivate"
                            onClick={() => handleReactivate(memberIndex)}
                            disabled={loadingIndex === memberIndex}
                          >
                            {loadingIndex === memberIndex ? (
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
                          onClick={() => openViewModal(memberIndex)}
                          disabled={loadingIndex === memberIndex}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>
                    No matching members found.
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
        title="Suspend Member"
      >
        <p>
          Enter the suspension duration and reason for {suspendIndex !== null && paginatedMembers[suspendIndex]?.name}.
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
        title="Revoke Membership"
      >
        <p>
          Select the reason for revoking {revokeIndex !== null && paginatedMembers[revokeIndex]?.name}'s membership.
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
        title="Member Details"
      >
        {viewIndex !== null && paginatedMembers[viewIndex] ? (
          <div className="view-details">
             <p><strong>User ID:</strong> {paginatedMembers[viewIndex].userId}</p>
            <p><strong>Name:</strong> {paginatedMembers[viewIndex].name}</p>
            <p><strong>Address:</strong> {paginatedMembers[viewIndex].address}</p>
            <p><strong>Contact Number:</strong> {paginatedMembers[viewIndex].contactNumber}</p>
            <p><strong>Email:</strong> {paginatedMembers[viewIndex].email}</p>
            <p><strong>Status:</strong> {paginatedMembers[viewIndex].status}</p>
            {paginatedMembers[viewIndex].status === 'Suspended' ? (
              <>
                <p><strong>Suspension Start:</strong> {formatDate(paginatedMembers[viewIndex].suspensionStart)}</p>
                <p><strong>Suspension Duration:</strong> {formatDuration(paginatedMembers[viewIndex].suspensionDuration)}</p>
                <p><strong>Suspension Reason:</strong> {paginatedMembers[viewIndex].suspensionReason || '-'}</p>
              </>
            ) : paginatedMembers[viewIndex].status === 'Revoked' ? (
              <p><strong>Revoke Reason:</strong> {paginatedMembers[viewIndex].revokeReason || '-'}</p>
            ) : null}
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeViewModal}>
                Close
              </button>
            </div>
          </div>
        ) : (
          <p>No member data available.</p>
        )}
      </Modal>
    </div>
  );
}

export default Members;