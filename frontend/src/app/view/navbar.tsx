'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import axios from 'axios'
import React from 'react'
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
        <div className="flex space-x-8">
          <div>
          <Link href={'calendar'}>
            <Image src={logo} alt="Logo" width={105} height={105} className="cursor-pointer" />
          </Link>
          </div>
          <div><NavLink path='calendar' text='TIMETABLE'></NavLink></div>
          <div><NavLink path='buildings' text='BUILDING'></NavLink></div>
          <div><NavLink path='personnel' text='PERSONNEL'></NavLink></div>
          <div><NavLink path='courses' text='COURSES'></NavLink></div>
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

  console.log('Current Path:', pathname); // Debugging to see the value of pathname

  return (
    <li>
      <Link
        href={path}
        className={`text-2xl font-mono font-extrabold p-2 rounded
          ${pathname === `/${path}` ? 'bg-gray-300 text-black' : 'text-white'}
          hover:bg-gray-300 hover:text-black`}
      >
        {text}
      </Link>
    </li>
  );
};
