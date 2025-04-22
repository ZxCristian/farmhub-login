import React, { useState } from 'react';
import '../Dashboard.css';

function ChangePasswordForm({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    // Simulate a successful password change (replace with actual API call)
    console.log('Password changed successfully:', { currentPassword, newPassword });
    alert('Password changed successfully!');
    onClose(); // Close the modal
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error-message">{error}</p>}
      <div className="form-group">
        <label htmlFor="current-password">Current Password</label>
        <input
          type="password"
          id="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Enter current password"
        />
      </div>
      <div className="form-group">
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
        />
      </div>
      <div className="form-group">
        <label htmlFor="confirm-password">Confirm New Password</label>
        <input
          type="password"
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
        />
      </div>
      <div className="modal-footer">
        <button type="button" className="btn-cancel" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn-save">
          Save
        </button>
      </div>
    </form>
  );
}

export default ChangePasswordForm;