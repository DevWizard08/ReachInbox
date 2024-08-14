import React from 'react';

const ResetConfirmation = ({ onResetConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Are you sure you want to reset your data?</h2>
        <div className="flex justify-end">
          <button onClick={onCancel} className="mr-2 bg-gray-300 text-black px-4 py-2 rounded">Cancel</button>
          <button onClick={onResetConfirm} className="bg-red-500 text-white px-4 py-2 rounded">Reset</button>
        </div>
      </div>
    </div>
  );
};

export default ResetConfirmation;