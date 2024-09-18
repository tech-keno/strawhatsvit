'use client';

import React, { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import logo from './vit_logo.png';

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
      }, { withCredentials: true });

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
    <div className="flex justify-center items-center min-h-screen bg-white">
      <header className="bg-white flex flex-col items-center justify-center text-lg text-black shadow-lg rounded-lg p-8 w-[350px]">
        <Image src={logo} alt="VIT Logo" className="w-64 mb-6" />
        <div className="text-center">
          <h1 className="text-3xl font-mono font-bold">Welcome Back</h1>
        </div>
        <form onSubmit={handleLoginSubmit} className="w-full">
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username or ID"
              value={username}
              onChange={handleInputChange}
              required
              className="w-full p-3 my-3 border border-gray-300 rounded"
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
              className="w-full p-3 my-3 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white p-4 mt-4 rounded hover:bg-orange-600"
          >
            Sign In
          </button>
        </form>
        <p className="text-red-500 mt-4">{responseMessage}</p>
        <a href="#" className="text-orange-500 text-sm mt-2 hover:underline">
          Forgot password?
        </a>
      </header>
    </div>
  );
}
