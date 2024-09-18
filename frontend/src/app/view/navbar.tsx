'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import axios from 'axios'
import React, { useState } from 'react'
import Image from 'next/image'
import logo from './vit_logo_alt.png'

export default function Navbar() {
  const handleLogout = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/logout', { withCredentials: true });
      if (response.status === 200) {
        window.location.href = '/login'; // Redirect to login page after logout
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="mb-4">
      <ul className="flex justify-between items-center bg-orange-500 p-9">
        <div className="flex items-center space-x-8"> {/* Added items-center here */}
          <div>
            <Link href={'/view/calendar'}>
              <Image src={logo} alt="Logo" width={105} height={105} className="cursor-pointer" />
            </Link>
          </div>
          <div><NavLink path='/view/calendar' text='TIMETABLE' /></div>
          <div><NavLink path='/view/buildings' text='BUILDING' /></div>
          <div>
            <DropdownNav text='PERSONNEL' options={[
              { path: '/view/personnel/students', text: 'STUDENTS' },
              { path: '/view/personnel/staff', text: 'STAFF' }
            ]} />
          </div>
          <div>
            <DropdownNav text='STUDY' options={[
              { path: '/view/study/courses', text: 'COURSES' },
              { path: '/view/study/units', text: 'UNITS' }
            ]} />
          </div>
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="text-2xl text-white hover:text-black hover:bg-gray-300 p-2 rounded font-mono font-extrabold">
            LOGOUT
          </button>
        </div>
      </ul>
    </nav>
  )
}

interface LinkProp {
  path: string
  text: string
}

const NavLink: React.FC<LinkProp> = ({ path, text }) => {
  const pathname = usePathname();

  return (
    <li>
      <Link
        href={path}
        className={`text-2xl font-mono font-extrabold p-2 rounded
          ${pathname === path ? 'bg-gray-300 text-black' : 'text-white'}
          hover:bg-gray-300 hover:text-black`}
      >
        {text}
      </Link>
    </li>
  );
};

interface DropdownNavProps {
  text: string;
  options: { path: string, text: string }[];
}

const DropdownNav: React.FC<DropdownNavProps> = ({ text, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleDropdown = (state: boolean) => {
    setIsOpen(state);
  };

  const handleToggleClick = () => {
    setIsOpen(!isOpen); // Toggle on click
  };

  // Check if any of the options is active
  const isActive = options.some(option => pathname === option.path);

  return (
    <li
      className="relative"
      onMouseEnter={() => toggleDropdown(true)}
      onMouseLeave={() => toggleDropdown(false)}
    >
      <button
        onClick={handleToggleClick}
        className={`text-2xl font-mono font-extrabold p-2 rounded
          ${isActive ? 'bg-gray-300 text-black' : 'text-white'}
          hover:bg-gray-300 hover:text-black`}
      >
        {text}
      </button>
      {isOpen && (
        <ul
          className="absolute left-0 top-full mt-0 bg-orange-500 p-2 space-y-2 rounded shadow-lg z-10"
        >
          {options.map(option => (
            <li key={option.path}>
              <Link
                href={option.path}
                className="block text-2xl font-mono font-extrabold text-white p-2 rounded hover:bg-gray-300 hover:text-black">
                {option.text}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};
