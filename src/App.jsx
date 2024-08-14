// App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import OneBoxScreen from './components/OneBoxScreen';
import Callback from './components/Callback';

const App = () => {
    

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/onebox" element={<OneBoxScreen />} />
                <Route path="/callback" element={<Callback />} />
            </Routes>
        </Router>
    );
};

export default App;
