import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import * as XLSX from 'xlsx';
import Sidebar from './Sidebar';
import Modal from './Modal';
import '../Dashboard.css';

function Customers() {
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
  const timerRef = useRef({});
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const defaultCustomers = [
    { userId: 1, name: "Alice Carter", address: "200 High St, Springfield", contactNumber: "555-200-0200", email: "alice.carter0@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 2, name: "Bob Davis", address: "201 Elm Ave, Rivertown", contactNumber: "555-201-0201", email: "bob.davis1@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 3, name: "Clara Evans", address: "202 Pine Rd, Lakeside", contactNumber: "555-202-0202", email: "clara.evans2@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 4, name: "Daniel Foster", address: "203 Maple Dr, Hillview", contactNumber: "555-203-0203", email: "daniel.foster3@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 5, name: "Emma Gray", address: "204 Birch Ln, Sunnyvale", contactNumber: "555-204-0204", email: "emma.gray4@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 6, name: "Frank Hughes", address: "205 Oak St, Brookfield", contactNumber: "555-205-0205", email: "frank.hughes5@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 7, name: "Grace Irwin", address: "206 Cedar St, Oakville", contactNumber: "555-206-0206", email: "grace.irwin6@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 8, name: "Henry Jones", address: "207 Walnut St, Riverbend", contactNumber: "555-207-0207", email: "henry.jones7@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 9, name: "Isabel Kelly", address: "208 Chestnut Ave, Greenwood", contactNumber: "555-208-0208", email: "isabel.kelly8@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 10, name: "Jack Lee", address: "209 Aspen Rd, Silverlake", contactNumber: "555-209-0209", email: "jack.lee9@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 11, name: "Kelly Martin", address: "210 Redwood Dr, Pinehill", contactNumber: "555-210-0210", email: "kelly.martin10@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 12, name: "Liam Nelson", address: "211 Spruce St, Fairview", contactNumber: "555-211-0211", email: "liam.nelson11@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 13, name: "Mia Owens", address: "212 Sycamore St, Forestville", contactNumber: "555-212-0212", email: "mia.owens12@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 14, name: "Noah Parker", address: "213 Poplar Ave, Hillcrest", contactNumber: "555-213-0213", email: "noah.parker13@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 15, name: "Olivia Quinn", address: "214 Willow Dr, Riverstone", contactNumber: "555-214-0214", email: "olivia.quinn14@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 16, name: "Peter Reed", address: "215 Fir Ln, Lakeview", contactNumber: "555-215-0215", email: "peter.reed15@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 17, name: "Quinn Scott", address: "216 Beech St, Glenwood", contactNumber: "555-216-0216", email: "quinn.scott16@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 18, name: "Rachel Turner", address: "217 Alder Rd, Meadowbrook", contactNumber: "555-217-0217", email: "rachel.turner17@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 19, name: "Samuel Vance", address: "218 Hickory St, Greenfield", contactNumber: "555-218-0218", email: "samuel.vance18@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 20, name: "Tara Wells", address: "219 Dogwood Ln, Hilldale", contactNumber: "555-219-0219", email: "tara.wells19@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 21, name: "Ursula Young", address: "220 Magnolia Ave, Stonebridge", contactNumber: "555-220-0220", email: "ursula.young20@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 22, name: "Victor Zane", address: "221 Locust Rd, Maplewood", contactNumber: "555-221-0221", email: "victor.zane21@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 23, name: "Wendy Adams", address: "222 Laurel St, Rosewood", contactNumber: "555-222-0222", email: "wendy.adams22@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 24, name: "Xavier Brooks", address: "223 Palm Ave, Creekside", contactNumber: "555-223-0223", email: "xavier.brooks23@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 25, name: "Yvonne Carter", address: "224 Cypress Rd, Cedarhill", contactNumber: "555-224-0224", email: "yvonne.carter24@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 26, name: "Zachary Dunn", address: "225 Sequoia Dr, Birchwood", contactNumber: "555-225-0225", email: "zachary.dunn25@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 27, name: "Amelia Evans", address: "226 Maple St, Westfield", contactNumber: "555-226-0226", email: "amelia.evans26@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 28, name: "Ben Foster", address: "227 Palm Dr, Eastview", contactNumber: "555-227-0227", email: "ben.foster27@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 29, name: "Chloe Gray", address: "228 Cedar Ave, Oakridge", contactNumber: "555-228-0228", email: "chloe.gray28@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 30, name: "Dylan Hughes", address: "229 Pine Ln, Meadowlark", contactNumber: "555-229-0229", email: "dylan.hughes29@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 31, name: "Ella Irwin", address: "230 Ash Rd, Foresthill", contactNumber: "555-230-0230", email: "ella.irwin30@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 32, name: "Finn Jones", address: "231 Cherry Dr, Bayview", contactNumber: "555-231-0231", email: "finn.jones31@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 33, name: "Gina Kelly", address: "232 Oak Ln, Greenridge", contactNumber: "555-232-0232", email: "gina.kelly32@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 34, name: "Hank Lee", address: "233 Poplar Rd, Hillbrook", contactNumber: "555-233-0233", email: "hank.lee33@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 35, name: "Ivy Martin", address: "234 Walnut Dr, Rivergrove", contactNumber: "555-234-0234", email: "ivy.martin34@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 36, name: "Jade Nelson", address: "235 Elm Ln, Cedarpark", contactNumber: "555-235-0235", email: "jade.nelson35@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 37, name: "Kyle Owens", address: "236 Pine Ave, Sunnyhill", contactNumber: "555-236-0236", email: "kyle.owens36@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 38, name: "Lily Parker", address: "237 Spruce Rd, Maplepark", contactNumber: "555-237-0237", email: "lily.parker37@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 39, name: "Mason Quinn", address: "238 Beech St, Lakepark", contactNumber: "555-238-0238", email: "mason.quinn38@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 40, name: "Nora Reed", address: "239 Redwood Ln, Grovefield", contactNumber: "555-239-0239", email: "nora.reed39@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 41, name: "Owen Scott", address: "240 Fir Rd, Springbrook", contactNumber: "555-240-0240", email: "owen.scott40@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 42, name: "Piper Turner", address: "241 Sycamore Dr, Evergreen", contactNumber: "555-241-0241", email: "piper.turner41@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 43, name: "Quincy Vance", address: "242 Locust Ln, Riverdale", contactNumber: "555-242-0242", email: "quincy.vance42@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 44, name: "Rose Wells", address: "243 Laurel Rd, Woodside", contactNumber: "555-243-0243", email: "rose.wells43@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 45, name: "Seth Young", address: "244 Hickory Ave, Brookside", contactNumber: "555-244-0244", email: "seth.young44@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 46, name: "Tina Zane", address: "245 Magnolia Ln, Timberlake", contactNumber: "555-245-0245", email: "tina.zane45@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 47, name: "Ulysses Adams", address: "246 Cherry St, Fairbrook", contactNumber: "555-246-0246", email: "ulysses.adams46@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 48, name: "Vera Brooks", address: "247 Dogwood Rd, Redwood", contactNumber: "555-247-0247", email: "vera.brooks47@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 49, name: "Wyatt Carter", address: "248 Chestnut Dr, Oakmeadow", contactNumber: "555-248-0248", email: "wyatt.carter48@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
    { userId: 50, name: "Zoe Dunn", address: "249 Palm Ln, Springhill", contactNumber: "555-249-0249", email: "zoe.dunn49@example.com", status: "Active", suspensionStart: null, suspensionDuration: null, suspensionReason: null, revokeReason: null },
  ];

  const [customers, setCustomers] = useState(() => {
    const savedCustomers = localStorage.getItem('customers');
    try {
      if (savedCustomers) {
        const parsedCustomers = JSON.parse(savedCustomers);
        const usedIds = new Set();
        return parsedCustomers.map((customer, index) => {
          let userId = customer.userId !== undefined ? Number(customer.userId) : index + 1;
          while (usedIds.has(userId)) {
            userId = Math.max(...usedIds) + 1;
          }
          usedIds.add(userId);
          return { ...customer, userId };
        });
      }
      return defaultCustomers;
    } catch (error) {
      console.error('Error parsing localStorage customers:', error);
      return defaultCustomers;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('customers', JSON.stringify(customers));
    } catch (error) {
      console.error('Error saving customers to localStorage:', error);
    }
  }, [customers]);

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

  const handleSearchChange = useCallback((value) => {
    let timeout;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setSearchTerm(value);
      }, 300);
    };
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter(
      (customer) =>
        (statusFilter === 'All' || customer.status === statusFilter) &&
        (customer.userId.toString().includes(searchTerm) ||
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.contactNumber.includes(searchTerm) ||
          customer.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (customer.suspensionReason && customer.suspensionReason.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (customer.revokeReason && customer.revokeReason.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  }, [customers, statusFilter, searchTerm]);

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
    const value = e.target.value === '100' ? sortedCustomers.length : Number(e.target.value);
    setRecordsPerPage(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
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
    { value: 'Inappropriate Behavior', label: 'Inappropriate Behavior' },
    { value: 'Fraudulent Activity', label: 'Fraudulent Activity' },
    { value: 'Other', label: 'Other' },
  ];

  const revokeReasons = [
    { value: '', label: 'Select a reason', disabled: true },
    { value: 'Policy Violation', label: 'Policy Violation' },
    { value: 'Failure to Pay', label: 'Failure to Pay' },
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
              {paginatedCustomers.length > 0 ? (
                paginatedCustomers.map((customer) => {
                  const customerIndex = paginatedCustomers.indexOf(customer);
                  return (
                    <tr key={customer.userId} className={`status-${customer.status.toLowerCase()}`}>
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
                              onClick={() => openSuspendModal(customerIndex)}
                              disabled={loadingIndex === customerIndex}
                              aria-label={`Suspend ${customer.name}`}
                            >
                              {loadingIndex === customerIndex ? (
                                <span>
                                  <span className="spinner"></span> Suspending...
                                </span>
                              ) : (
                                'Suspend'
                              )}
                            </button>
                            <button
                              className="action-btn revoke"
                              onClick={() => openRevokeModal(customerIndex)}
                              disabled={loadingIndex === customerIndex}
                              aria-label={`Revoke ${customer.name}`}
                            >
                              {loadingIndex === customerIndex ? (
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
                            onClick={() => handleReactivate(customerIndex)}
                            disabled={loadingIndex === customerIndex}
                            aria-label={`Reactivate ${customer.name}`}
                          >
                            {loadingIndex === customerIndex ? (
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
                          onClick={() => openViewModal(customerIndex)}
                          disabled={loadingIndex === customerIndex}
                          aria-label={`View details for ${customer.name}`}
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