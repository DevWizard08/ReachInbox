// ReplyForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const ReplyForm = ({ thread, onSuccess, onError }) => {
    const [replyBody, setReplyBody] = useState('');

    const handleSendReply = async () => {
        const token = localStorage.getItem('authToken');

        if (!token) {
            onError("No authentication token found. Please log in.");
            return;
        }

        try {
            const response = await axios.post(`https://hiring.reachinbox.xyz/api/v1/onebox/${thread.id}`, {
                from: localStorage.getItem('userEmail'),
                to: thread.fromEmail,
                subject: `Re: ${thread.subject}`,
                body: replyBody
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                onSuccess("Reply sent successfully!");
                setReplyBody('');
            } else {
                onError("Failed to send reply.");
            }
        } catch (error) {
            console.error("Error sending reply:", error);
            onError("Error sending reply");
        }
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-lg border border-gray-200">
            <textarea
                className="w-full h-32 p-2 border border-gray-300 rounded-lg mb-4"
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                placeholder="Type your reply here..."
            />
            <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={handleSendReply}
            >
                Send Reply
            </button>
        </div>
    );
};

export default ReplyForm;
