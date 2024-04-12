import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateWrapperProps {
  children: ReactNode; 
}

const PrivateWrapper: React.FC<PrivateWrapperProps> = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" />;
    }
    return <>{children}</>;
};

export default PrivateWrapper;