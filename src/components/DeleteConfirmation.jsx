import React from 'react';
import axios from 'axios';

const DeleteConfirmation = ({ threadId, onDeleteConfirm, onCancel }) => {
  const handleDelete = async () => {
    const token = localStorage.getItem('authToken');
    try {
      await axios.delete(`https://hiring.reachinbox.xyz/api/v1/onebox/delete/${threadId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onDeleteConfirm(); // Call the confirmation callback
    } catch (error) {
      alert('Error deleting email');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Are you sure you want to delete this email?</h2>
        <div className="flex justify-end">
          <button onClick={onCancel} className="mr-2 bg-gray-300 text-black px-4 py-2 rounded">Cancel</button>
          <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;