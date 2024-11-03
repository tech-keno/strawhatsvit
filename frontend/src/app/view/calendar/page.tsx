"use client"; 

import Calendar from "./calendar";
import React, { useState } from 'react';


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


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0]; // Get the selected file

      const formData = new FormData();
      formData.append("file", selectedFile); // Append the selected file to FormData

      try {
        const response = await fetch("http://127.0.0.1:5000/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          console.log("File uploaded successfully:", result);
          alert("File uploaded successfully!");
        } else {
          console.error("File upload failed:", response.statusText);
          alert("File upload failed.");
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("An error occurred while uploading the file.");
      }
    }
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

            <input
              type="file"
              id="fileInput"
              onChange={handleFileChange}
              style={{ display: "none" }} // Hide the input
            />

            <button
              className="px-4 py-2 font-semibold text-gray-800 transition-all duration-300 ease-in-out bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 active:bg-gray-200 active:scale-95"
              onClick={() => {
                document.getElementById("fileInput")?.click(); // Trigger file input click
              }}
            >
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
