'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function Navbar() {

  return (
    <nav className="mb-4">
      <ul className="flex space-x-4">
        <NavLink path='calendar' text='Calendar'></NavLink>
        <NavLink path='courses' text='Courses'></NavLink>
        <NavLink path='buildings' text='Buildings'></NavLink>
        <NavLink path='students' text='Students'></NavLink>
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
            className={`text-gray-600 hover:text-blue-600`}
          >
            {text}
          </Link>
        </li>
    );
};