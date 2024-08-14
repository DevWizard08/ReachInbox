import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import DeleteConfirmation from './DeleteConfirmation'; // Import the DeleteConfirmation component
import ResetConfirmation from './ResetConfirmation'; // Import the ResetConfirmation component
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const OneBoxScreen = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedThread, setSelectedThread] = useState(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State for delete confirmation
  const [showResetConfirmation, setShowResetConfirmation] = useState(false); // State for reset confirmation
  const [replyData, setReplyData] = useState({ to: '', from: '', subject: '', body: '' });
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light'); // Theme state

  // Fetch threads from API
  const fetchThreads = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError("No authentication token found. Please log in.");
      setLoading(false);
      return;
    }
    try {
      
      const response = await axios.get("https://hiring.reachinbox.xyz/api/v1/onebox/list", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = response.data.data || response.data;
      if (Array.isArray(data)) {
        setThreads(data);
      } else {
        setError("Unexpected response format. Data is not an array.");
      }
    } catch (error) {
      setError("Error fetching threads");
    } finally {
      setLoading(false);
    }
  };

  // Handle thread selection
  const handleSelectThread = (thread) => {
    setSelectedThread(thread);
    setReplyData({
      to: thread.fromEmail, // Auto-fill "To" field
      from: '', // You can set this to the user's email if available
      subject: `Re: ${thread.subject}`,
      body: ''
    });
    setShowReplyForm(false); // Hide the reply form initially
    setShowDeleteConfirmation(false); // Reset delete confirmation visibility
    setShowResetConfirmation(false); // Reset reset confirmation visibility
  };

  // Handle reply input changes
  const handleReplyChange = (e) => {
    const { name, value } = e.target;
    setReplyData(prev => ({ ...prev, [name]: value }));
  };

  // Handle reply submission
  const handleReplySubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const token = localStorage.getItem('authToken');
    try {
      await axios.post(`https://hiring.reachinbox.xyz/api/v1/reply/${selectedThread.id}`, replyData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Reply sent successfully!');
      setReplyData({ to: '', from: '', subject: '', body: '' }); // Reset reply data
      setShowReplyForm(false); // Hide the reply form after submission
      fetchThreads(); // Refresh the threads list
    } catch (error) {
      alert('Error sending reply');
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    fetchThreads(); // Refresh the threads after deletion
    setSelectedThread(null); // Clear selected thread
    setShowDeleteConfirmation(false); // Close the confirmation dialog
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false); // Close the confirmation dialog
  };

  // Handle reset confirmation
  const handleResetConfirm = async () => {
    const token = localStorage.getItem('authToken');
    try {
      await axios.get("https://hiring.reachinbox.xyz/api/v1/onebox/reset", {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Data has been reset successfully!');
    } catch (error) {
      alert('Error resetting data');
    } finally {
      setShowResetConfirmation(false); // Close the confirmation dialog
      navigate('/'); // Redirect to login page regardless of success or failure
    }
  };

  const handleResetCancel = () => {
    setShowResetConfirmation(false); 
    navigate('/'); 
    // Close the confirmation dialog
  };

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'd' || event.key === 'D') {
        if (selectedThread) {
          setShowDeleteConfirmation(true);
        }
      } else if (event.key === 'r' || event.key === 'R') {
        if (selectedThread) {
          setShowReplyForm(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedThread]);

  useEffect(() => {
    fetchThreads();

  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className={`flex flex-col h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <div className="flex-grow flex overflow-hidden">
        {/* Sidebar */}
        <div className={`w-1/3 p-4 border-r border-gray-300 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50'} overflow-y-auto`}>
          <h1 className="text-lg font-bold mb-4">Inbox</h1>
          <button 
            onClick={toggleTheme} 
            className={`mb-4 px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-300 text-black hover:bg-gray-400'}`}
          >
            Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </button>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {!loading && !error && (
            <ul className="space-y-2">
              {threads.map(thread => (
                <li key={thread.id} 
                    onClick={() => handleSelectThread(thread)} 
                    className="cursor-pointer p-2 border rounded hover:bg-gray-100 text-sm">
                  {thread.subject}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Main Content */}
        <div className={`flex-1 p-4 overflow-y-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          {selectedThread ? (
            <div className={`border rounded p-4 shadow-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
              <h2 className="text-xl font-semibold mb-2">{selectedThread.subject}</h2>
              <p className="text-sm mb-2"><strong>From:</strong> {selectedThread.fromName} ({selectedThread.fromEmail})</p>
              <p className="text-sm mt-2 mb-4" dangerouslySetInnerHTML={{ __html: selectedThread.body }}></p>
              <p className="text-gray-500 text-xs">Sent on {dayjs(selectedThread.sentAt).format('MMM D, YYYY')}</p>

              {/* Reply Button */}
              <button 
                onClick={() => setShowReplyForm(true)} 
                className={`mt-4 px-4 py-2 rounded ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-sm`}>
                Reply
              </button>

              {/* Delete Button */}
              <button 
                onClick={() => setShowDeleteConfirmation(true)} 
                className={`mt-4 px-4 py-2 rounded ${theme === 'dark' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} ml-2 text-sm`}>
                Delete
              </button>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Select an email to view details.</p>
          )}

          {/* Reply Form */}
          {showReplyForm && selectedThread && (
            <form onSubmit={handleReplySubmit} className={`mt-4 p-4 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="mb-2">
                <label className="block text-xs font-medium">To:</label>
                <input
                  type="email"
                  name="to"
                  value={replyData.to}
                  onChange={handleReplyChange}
                  className={`border rounded w-full p-2 mt-1 text-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white'}`}
                  readOnly
                />
              </div>
              <div className="mb-2">
                <label className="block text-xs font-medium">From:</label>
                <input
                  type="email"
                  name="from"
                  value={replyData.from}
                  onChange={handleReplyChange}
                  className={`border rounded w-full p-2 mt-1 text-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white'}`}
                />
              </div>
              <div className="mb-2">
                <label className="block text-xs font-medium">Subject:</label>
                <input
                  type="text"
                  name="subject"
                  value={replyData.subject}
                  onChange={handleReplyChange}
                  className={`border rounded w-full p-2 mt-1 text-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white'}`}
                />
              </div>
              <div className="mb-2">
                <label className="block text-xs font-medium">Message:</label>
                <textarea
                  name="body"
                  value={replyData.body}
                  onChange={handleReplyChange}
                  className={`border rounded w-full p-2 mt-1 text-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white'}`}
                  rows="4"
                ></textarea>
              </div>
              <div className="flex items-center mt-4">
                <button 
                  type="button" 
                  onClick={() => alert('Save functionality is not implemented yet.')} 
                  className={`bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-sm mr-2 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-500'}`}
                >
                  SAVE
                </button>
                <button 
                  type="button" 
                  onClick={() => alert('Variables functionality is not implemented yet.')} 
                  className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm mr-2 ${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'}`}
                >
                  Variables
                </button>
                <button 
                  type="submit" 
                  className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm ${theme === 'dark' ? 'bg-green-600' : 'bg-green-500'}`}
                >
                  Submit
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className={`p-4 border-t border-gray-300 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <button 
          onClick={() => setShowResetConfirmation(true)} 
          className={`bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 text-sm ${theme === 'dark' ? 'bg-yellow-600' : 'bg-yellow-500'}`}
        >
          Reset
        </button>
        {/* Note: Reply button removed from the footer */}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirmation && (
        <DeleteConfirmation 
          onConfirm={handleDeleteConfirm} 
          onCancel={handleDeleteCancel} 
        />
      )}

      {/* Reset Confirmation Dialog */}
      {showResetConfirmation && (
        <ResetConfirmation 
          onConfirm={handleResetConfirm} 
          onCancel={handleResetCancel} 
        />
      )}
    </div>
  );
};

export default OneBoxScreen;
