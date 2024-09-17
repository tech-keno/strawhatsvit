'use client';

import React, { useState } from 'react';
import DataTable from 'react-data-table-component';

export default function Personnel() {
    // Initial rows structure: Staff/Student, ID, Name, Course Enrolled
    const initialRows = [
        { id: 'person1', role: 'Staff', idNumber: 'S123', name: 'John Doe', courseEnrolled: 'N/A' }
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
            id: `person${gridRows.length + 1}`,
            role: '',
            idNumber: '',
            name: '',
            courseEnrolled: ''
        };
        setGridRows([...gridRows, newRow]);
    };

    // Define columns for the DataTable component
    const columns = [
        {
            name: 'Staff/Student',
            selector: row => row.role,
            cell: row => (
                <input
                    type="text"
                    value={row.role}
                    onChange={e => onFieldChange(row.id, 'role', e.target.value)}
                />
            )
        },
        {
            name: 'ID',
            selector: row => row.idNumber,
            cell: row => (
                <input
                    type="text"
                    value={row.idNumber}
                    onChange={e => onFieldChange(row.id, 'idNumber', e.target.value)}
                />
            )
        },
        {
            name: 'Name',
            selector: row => row.name,
            cell: row => (
                <input
                    type="text"
                    value={row.name}
                    onChange={e => onFieldChange(row.id, 'name', e.target.value)}
                />
            )
        },
        {
            name: 'Course Enrolled',
            selector: row => row.courseEnrolled,
            cell: row => (
                <input
                    type="text"
                    value={row.courseEnrolled}
                    onChange={e => onFieldChange(row.id, 'courseEnrolled', e.target.value)}
                />
            )
        }
    ];

    return (
        <div className="px-4 py-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Personnel</h1>
                <div className="flex space-x-2">
                    <button 
                        onClick={addRow} 
                        className="px-4 py-2 bg-white text-black border border-black rounded shadow transition duration-200 ease-in-out transform hover:bg-gray-200 hover:scale-105 active:scale-95"
                    >
                        +
                    </button>
                    <button 
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
