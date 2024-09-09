'use client';

import React, { useState } from 'react';
import axios from 'axios';
import './login.css';
import { redirect } from 'next/navigation'

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });

      if (response.status === 200) {
        setResponseMessage('Login successful');
      } else {

        setResponseMessage('Login failed');
      }
    } catch (error) {
      setResponseMessage('Error: Login failed');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleLoginSubmit}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <p>{responseMessage}</p>
      </header>
    </div>
  );
}
