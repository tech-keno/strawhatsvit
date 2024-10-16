'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import logo from './vit_logo_alt.png'
import sampleImage from './sample_enrolment_data.png' // Import the image
import HelpTable from './helpTable'

export default function Navbar() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [csvData, setCsvData] = useState<string[][]>([]); // State to store CSV data

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

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <nav className="mb-4">
      <ul className="flex justify-between items-center bg-orange-500 p-9">
        <div className="flex items-center space-x-8">
          <div>
            <Link href={'/view/calendar'}>
              <Image src={logo} alt="Logo" width={105} height={105} className="cursor-pointer" />
            </Link>
          </div>
          <div><NavLink path='/view/calendar' text='TIMETABLE' /></div>
          <div><NavLink path='/view/buildings' text='BUILDING' /></div>
          <div>
            <DropdownNav text='STUDY' options={[
              { path: '/view/study/courses', text: 'COURSES' },
              { path: '/view/study/units', text: 'UNITS' }
            ]} />
          </div>
          <div>
            <DropdownNav text='PERSONNEL' options={[
              { path: '/view/personnel/students', text: 'STUDENTS' },
              { path: '/view/personnel/staff', text: 'STAFF' }
            ]} />
          </div>
        </div>
        <div className="flex space-x-4 items-center">
          {/* Question mark button */}
          <button
            onClick={togglePopup}
            className="text-2xl text-white bg-blue-500 border-2 border-white hover:bg-gray-300 p-2 rounded-full font-mono font-extrabold transition-colors duration-200 ease-in-out"
            style={{ width: '50px', height: '50px', lineHeight: '1.5rem' }}
          >
            ?
          </button>
          <button
            onClick={handleLogout}
            className="text-2xl text-white hover:text-black hover:bg-[#FDEBD0] p-2 rounded font-mono font-extrabold">
            LOGOUT
          </button>
        </div>
      </ul>

      {/* Popup Window */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-[80%] h-[80%] p-8 rounded-lg shadow-lg overflow-auto relative">
            <h2 className="text-2xl font-bold mb-4">How to Use</h2>
            <p className="text-lg mt-4">Uploading data should be in the following format:</p>

            {/* Render the HelpTable component here */}
            <HelpTable />

            {/* Instructions */}
            <p className="text-lg mt-4">Enrolment data can be uploaded from the Timetable page.</p>
            <p className="text-lg mt-4">Rest of the data input order should be the Buildings, Study, then Personnel pages.</p>
            <p className="text-lg mt-4">Once data is entered, click Generate on the Timetable page, individual classes can dragged/edited.</p>

            <button
              onClick={() => setIsPopupOpen(false)}
              className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
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
          ${pathname === path ? 'bg-[#FDEBD0] text-black' : 'text-white'}
          hover:bg-[#FDEBD0] hover:text-black`}
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
          ${isActive ? 'bg-[#FDEBD0] text-black' : 'text-white'}
          hover:bg-[#FDEBD0] hover:text-black`}
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
                className="block text-2xl font-mono font-extrabold text-white p-2 rounded hover:bg-[#FDEBD0] hover:text-black">
                {option.text}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};
