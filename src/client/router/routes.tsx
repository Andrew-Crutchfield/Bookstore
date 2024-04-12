import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../components/Home';
import Listing from '../components/Listing';
import Details from '../components/details';

const AppRouter: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/booklisting" element={<Listing />} />
            <Route path="/bookdetails" element={<Details />} />
        </Routes>
    );
};

export default AppRouter;
