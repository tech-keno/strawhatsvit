'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function Navbar() {

  return (
    <nav className="mb-4">
      <ul className="flex space-x-8 bg-orange-500 p-9 ">
        <li><NavLink path='calendar' text='TIMETABLE'></NavLink></li>
        <li><NavLink path='buildings' text='BUILDING'></NavLink></li>
        <li><NavLink path='students' text='PERSONNEL'></NavLink></li>
        <li><NavLink path='courses' text='COURSES'></NavLink></li>
      </ul>
    </nav>
  )
}

interface LinkProp {
    path: string
    text: string
}

const NavLink: React.FC<LinkProp> = ({ path, text }) =>{
    return(
        <li>
          <Link 
            href={path} 
            className={`text-2xl text-gray-600 hover:text-blue-600 font-mono font-extrabold text-white`}
          >
            {text}
          </Link>
        </li>
    );
};