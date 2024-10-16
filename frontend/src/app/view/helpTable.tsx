import React from 'react';

export default function HelpTable() {
  return (
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr>
          {['StudentID', 'Student Name', 'Personal Email', 'University Email', 'Student Type', 'Offer Type', 'Course Name', 'Campus', 'Original COE Start Date', 'Course Start Date', 'Course End Date', 'COE Status', 'Specialisation', 'Pathway Indicator', 'MITS4001', 'MITS4002', 'MITS4003', 'MITS4004', 'MITS5001', 'MITS5002', 'MITS5003', 'MITS5004', 'MITS5501', 'MITS5502', 'MITS5503', 'MITS5505', 'MITS5507', 'MITS5509', 'MITS6001', 'MITS6002', 'MITS6004', 'MITS6005', 'MITS6011', 'MITS6500', 'MITS5512'].map((header) => (
            <th key={header} className="border px-4 py-2 text-left">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[
          ['1234', 'Saurabh Mehta', '', '', 'CRICOS Onshore Enrolment', 'New Offer', 'Master of Information Technology and Systems', 'Adelaide', '13/03/2023', '13/03/2023', '23/02/2025', 'Studying', 'No-Specialization Path', 'No', 'C', 'BCohort A', 'CT', 'C', 'CT', 'CT', 'ENRL', 'C', 'ENRL', 'ENRL', '', '', '', 'ENRL', '', '', '', '', '', ''],
          ['5678', 'Kalindi', '', '', 'CRICOS Onshore Enrolment', 'New Offer', 'Master of Information Technology and Systems', 'Adelaide', '27/02/2023', '27/02/2023', '23/02/2025', 'Studying', 'No-Specialization Path', 'No', 'C', 'BCohort B', 'ENRL', 'B', 'ENRL', 'ENRL', 'ENRL', '', '', '', '', '', '', '', '', '', '', '', ''],
          ['9101', 'Vo', '', '', 'CRICOS Onshore Enrolment', 'New Offer', 'Master of Information Technology and Systems', 'Adelaide', '26/09/2022', '26/09/2022', '22/09/2024', 'Studying', 'No-Specialization Path', 'No', 'C', 'C', 'DCohort A', 'C', 'ENRL', 'D', 'B', 'C', 'ENRL', 'ENRL', '', '', '', '', 'ENRL', '', '', '', '', ''],
          ['1213', 'Robert', '', '', 'CRICOS Onshore Enrolment', 'New Offer', 'Master of Information Technology and Systems', 'Adelaide', '26/09/2022', '26/09/2022', '22/09/2024', 'Studying', 'Analytics', 'No', 'C', 'C', 'DCohort A', 'B', 'B', 'D', 'ENRL', 'C', '', '', 'ENRL', '', 'ENRL', '', 'ENRL', '', '', '', '', '']
        ].map((row, idx) => (
          <tr key={idx} className="even:bg-gray-100">
            {row.map((cell, cellIdx) => (
              <td key={cellIdx} className="border px-4 py-2">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
