// src/components/Header.js
import React from 'react';
import logo from '../assets/reachinbox_logo.png';

function Header() {
    return (
        <header className="flex justify-center items-center bg-black p-4">
            <img src={logo} alt="Logo" className="mr-2 w-10 h-10" />
            <h1 className="text-3xl font-bold text-white">REACHINBOX</h1>
        </header>
    );
}

export default Header;
