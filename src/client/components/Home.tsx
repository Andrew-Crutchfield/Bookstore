import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { POST } from '../services/fetcher';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      const response = await POST('/api/auth/login', { email, password });
      if (response.token) {
        localStorage.setItem('token', response.token);
        navigate('/bookdetails');
      } else {
        setErrorMessage(response.message || 'Failed to log in');
      }
    } catch (error) {
      console.error('Login failed', error);
      if (error instanceof Error) {
        setErrorMessage(error.message || 'Login failed due to an unexpected error');
      } else {
        setErrorMessage('Login failed due to an unexpected error');
      }
    }
  };

  const handleRegister = async () => {
    try {
      const response = await POST('/auth/register', { email, password });
      if (response.token) {
        localStorage.setItem('token', response.token);
        navigate('/bookdetails');
      } else {
        setErrorMessage('Failed to register');
      }
    } catch (error) {
      console.error('Registration failed', error);
      setErrorMessage('Registration failed due to an error');
    }
  };

  return (
    <div>
      <h1>Welcome to Our HomePage</h1>
      <div>Login or Register to Continue</div>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      <label>Email: </label>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label>Password: </label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default HomePage;
