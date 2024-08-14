import React, { useEffect } from 'react';

function Callback() {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
            // Send token to the original tab
            if (window.opener) {
                window.opener.postMessage({ token }, 'https://frontend.com'); // Adjust origin to your frontend domain
            }

            // Optionally close the callback tab
            window.close();
        }
    }, []);

    return <div>Loading...</div>;
}

export default Callback;
