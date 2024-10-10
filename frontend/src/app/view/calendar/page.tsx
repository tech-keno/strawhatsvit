'use client'
import Calendar from "./calendar";
import React, { useState } from 'react';

export default function Home() {
  const [hasCalendar, setHasCalendar] = useState(false);

  const createCalendar = () => setHasCalendar(true);
  const uploadFile = () => {
    // do stuff
  };


  return (
    <div>
      {hasCalendar ? (
        <div>
          <Calendar/>
        </div>
      ) : (
        <div className="flex items-center justify-center p-4 flex-col gap-x-20 space-y-10">
          <h1 className="text-5xl ">No Timetable Selected</h1>
          <div className="space-x-10">
            <button className="px-4 py-2 font-semibold text-gray-800 transition-all duration-300 ease-in-out bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 active:bg-gray-200 active:scale-95"
              onClick={uploadFile}>
              Upload
            </button>
            <button className="px-4 py-2 font-semibold text-white transition-all duration-300 ease-in-out bg-gradient-to-r from-gray-800 to-gray-900 rounded-md shadow-md hover:from-gray-900 hover:to-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 active:scale-95"
              onClick={createCalendar}>
              Generate
            </button>
          </div>
        </div>
      )}
    </div>
  );

}
