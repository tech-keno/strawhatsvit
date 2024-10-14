"use client"; 

import Calendar from "./calendar";
import React, { useState } from 'react';

// Rest of your component...


// Use an alias for the Event type if you need to
type CalendarEvent = {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"
  startTime: string
  endTime: string
  unit: string
  lecturer: string
  deliveryMode: "Virtual" | "In-Person"
  classroom: string
  course: string
}
export default function Home() {
  const [calendarData, setCalendarData] = useState<CalendarEvent[]>([]);
  const [hasCalendar, setHasCalendar] = useState(false);

  const uploadFile = () => {
    // Do stuff
  };

  const createCalendar = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/generate', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data: CalendarEvent[] = await response.json();  // Ensure the correct type here
        setCalendarData(data); // Store the fetched data
        console.log(data);

        setHasCalendar(true);  // Set flag to show the calendar
      } else {
        console.error('Error fetching collated info:', response.statusText);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  return (
    <div>
      {hasCalendar ? (
        <div>
          <Calendar data={calendarData} />
        </div>
      ) : (
        <div className="flex items-center justify-center p-4 flex-col gap-x-20 space-y-10">
          <h1 className="text-5xl">No Timetable Selected</h1>
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
