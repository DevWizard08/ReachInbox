import React, { useEffect } from 'react';
import { Button, Link } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CreateAccountButton from './CreateAccountButton';

function Login() {
    const navigate = useNavigate();

    useEffect(() => {
        // Listen for messages from the new tab
        const handleMessage = (event) => {
            if (event.origin === 'https://frontend.com') { // Adjust the origin to your frontend domain
                const { token } = event.data;

                if (token) {
                    // Save token to local storage
                    localStorage.setItem('authToken', token);

                    // Redirect to /onebox
                    navigate('/onebox');
                }
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [navigate]);

    const handleGoogleSignIn = () => {
        const redirectUrl = encodeURIComponent("https://frontend.com"); // Adjust callback URL
        const googleLoginUrl = `https://hiring.reachinbox.xyz/api/v1/auth/google-login?redirect_to=${redirectUrl}`;
        window.open(googleLoginUrl, '_blank');
    };

    const handleRerouteToOnebox = () => {
        navigate('/onebox');
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex flex-col flex-grow justify-center items-center bg-black p-6">
                <div className="w-full max-w-md bg-black rounded-lg shadow-md p-6 outline outline-offset-2 outline-gray-500 space-y-4">
                    <h2 className="text-xl font-semibold text-white text-center">Create a New Account</h2>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleGoogleSignIn}
                        startIcon={<GoogleIcon />}
                        className="w-full mb-4"
                    >
                        <p className='text-white'>Sign Up With Google</p>
                    </Button>
                    <div className="text-center text-white">
                        <CreateAccountButton onClick={handleGoogleSignIn} />
                    </div>
                    <div className="text-center text-white">
                        <p className="text-sm">
                            Already have an account? 
                            <Link href="/signin" className="text-blue-500 ml-1">
                                Sign In
                            </Link>
                        </p>
                    </div>
                    <div className="text-center mt-4">
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleRerouteToOnebox}
                            className="w-full"
                        >
                            Go to OneBox
                        </Button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Login;
