// src/components/CreateAccountButton.jsx
import React from 'react';

const CreateAccountButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
    >
      Create an Account
    </button>
  );
};

export default CreateAccountButton;
