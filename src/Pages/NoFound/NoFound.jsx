import React from 'react';
import { Link } from 'react-router-dom';

const NoFound = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/register" style={{ color: '#007bff', textDecoration: 'none' }}>
        Go to Register
      </Link>
    </div>
  );
};

export default NoFound;
