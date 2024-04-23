import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs'; // Import bcryptjs library

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const usersResponse = await fetch('/data/users.json');
      const usersData = await usersResponse.json();
      const users = usersData.users;

      const user = users.find((u: any) => u.email === email);

      if (user && bcrypt.compareSync(password, user.password)) { // Compare hashed password
        localStorage.setItem('token', user.token);
        navigate('/bookdetails');
      } else {
        setErrorMessage('Invalid email or password');
      }
    } catch (error) {
      console.error('Login failed', error);
      setErrorMessage('Login failed due to an unexpected error');
    }
  };

  const handleRegister = async () => {
    try {
      // Hash the password before sending to the server
      const hashedPassword = bcrypt.hashSync(password, 10);

      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: hashedPassword }), // Send hashed password
      });
      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('token', data.token);
          navigate('/bookdetails');
        } else {
          setErrorMessage('Failed to register');
        }
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
      <h1>Welcome to Our Home Page</h1>
      <div>Login or Register to Continue</div>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
        <button type="button" onClick={handleRegister}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Home;
