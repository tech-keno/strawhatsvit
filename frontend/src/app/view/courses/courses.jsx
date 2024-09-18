'use client';

import React, { useState } from 'react';
import DataTable from 'react-data-table-component';

export default function Courses() {
    // Initial rows structure: Course Name, Prerequisites, Students Enrolled, Subjects
    const initialRows = [
        { id: 'course1', courseName: 'Course A', prerequisites: 'None', studentsEnrolled: '50', subjects: '5' }
    ];

    const [gridRows, setGridRows] = useState(initialRows);

    // Function to handle changes in the table fields
    const onFieldChange = (rowId, field, value) => {
        const updatedRows = gridRows.map(row =>
            row.id === rowId ? { ...row, [field]: value } : row
        );
        setGridRows(updatedRows);
    };

    // Function to add a new row
    const addRow = () => {
        const newRow = {
            id: `course${gridRows.length + 1}`,
            courseName: '',
            prerequisites: '',
            studentsEnrolled: '',
            subjects: ''
        };
        setGridRows([...gridRows, newRow]);
    };
    const saveData = () => {
        fetch('http://127.0.0.1:5000/document', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(gridRows),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert('Data saved successfully!');
            } else {
                alert('Failed to save data');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };


    // Define columns for the DataTable component
    const columns = [
        {
            name: 'Course Name',
            selector: row => row.courseName,
            cell: row => (
                <input
                    type="text"
                    value={row.courseName}
                    onChange={e => onFieldChange(row.id, 'courseName', e.target.value)}
                />
            )
        },
        {
            name: 'Prerequisites',
            selector: row => row.prerequisites,
            cell: row => (
                <input
                    type="text"
                    value={row.prerequisites}
                    onChange={e => onFieldChange(row.id, 'prerequisites', e.target.value)}
                />
            )
        },
        {
            name: 'Students Enrolled',
            selector: row => row.studentsEnrolled,
            cell: row => (
                <input
                    type="text"
                    value={row.studentsEnrolled}
                    onChange={e => onFieldChange(row.id, 'studentsEnrolled', e.target.value)}
                />
            )
        },
        {
            name: 'Subjects',
            selector: row => row.subjects,
            cell: row => (
                <input
                    type="text"
                    value={row.subjects}
                    onChange={e => onFieldChange(row.id, 'subjects', e.target.value)}
                />
            )
        }
    ];

    return (
        <div className="px-4 py-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Courses</h1>
                <div className="flex space-x-2">
                    <button 
                        onClick={addRow} 
                        className="px-4 py-2 bg-white text-black border border-black rounded shadow transition duration-200 ease-in-out transform hover:bg-gray-200 hover:scale-105 active:scale-95"
                    >
                        +
                    </button>
                    <button 
                        onClick={saveData}
                        className="px-4 py-2 bg-black text-white rounded shadow transition duration-200 ease-in-out transform hover:bg-gray-800 hover:scale-105 active:scale-95"
                    >
                        SAVE
                    </button>
                </div>
            </div>
            <DataTable
                columns={columns}
                data={gridRows}
                noHeader
                pagination
                customStyles={{
                    headRow: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '16px',
                            borderBottom: '2px solid #e5e7eb',
                        },
                    },
                    cells: {
                        style: {
                            padding: '8px',
                        },
                    },
                }}
            />
        </div>
    );
}
