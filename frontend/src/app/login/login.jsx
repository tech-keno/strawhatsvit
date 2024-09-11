'use client';

import React, { useState } from 'react';
import axios from 'axios';
import './login.css';
import Image from 'next/image'
import logo from './vit_logo.png'
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
      const response = await axios.post('http://127.0.0.1:5000/login', {
        username,
        password,
      }, { withCredentials: true }) 
      if (response.status === 200) {
        setResponseMessage('Login successful');
        window.location.href = '/view/calendar'; 
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        setResponseMessage(`Error: ${error.response.data.error}`);
      } else {
        setResponseMessage('Error: Login failed');
      }
    }
  };
  

  return (
    <div className="App">
      <header className="App-header">
        <Image src={logo} alt="VIT Logo" className="App-logo" />
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontWeight: 'bold' }}>Welcome Back</h1>
        </div>
        <form onSubmit={handleLoginSubmit}>
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username or ID"
              value={username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">Sign In</button>
        </form>
        <p>{responseMessage}</p>
        <a href="#">Forgot password?</a>
      </header>
    </div>
  );
}
