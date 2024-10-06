'use client';

import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';

export default function Staff() {
    const [gridRows, setGridRows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/documents/staff')
            .then(response => response.json())
            .then(data => {
                setGridRows(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);

    const onFieldChange = (rowId, field, value) => {
        const updatedRows = gridRows.map(row =>
            row.id === rowId ? { ...row, [field]: value } : row
        );
        setGridRows(updatedRows);
    };

    const addRow = () => {
        const newRow = {
            id: `person${Date.now()}`, // Unique id based on timestamp
            idNumber: '',
            name: '',
            campus: '',  // Added Campus field
            course: '',   // Changed from unitsTaught to course
            unitsCode: '' // New field for Units (Code)
        };
        setGridRows([...gridRows, newRow]);
    };

    const deleteRow = (rowId) => {
        console.log(rowId)
        fetch(`http://127.0.0.1:5000/document/staff/${rowId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                setGridRows(gridRows.filter(row => row.id !== rowId)); // Remove from frontend
            } else {
                alert('Failed to delete document');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };


    const saveData = () => {
        fetch('http://127.0.0.1:5000/document/staff', {
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
                // Optionally refresh data
                fetch('http://127.0.0.1:5000/documents/staff')
                    .then(response => response.json())
                    .then(data => setGridRows(data));
            } else {
                alert('Failed to save data');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    const columns = [
        {
            name: 'ID Number',
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
            name: 'Campus',  // Added Campus column
            selector: row => row.campus,
            cell: row => (
                <input
                    type="text"
                    value={row.campus}
                    onChange={e => onFieldChange(row.id, 'campus', e.target.value)}
                />
            )
        },
        {
            name: 'Course',  // Changed from Units Taught to Course
            selector: row => row.course,
            cell: row => (
                <input
                    type="text"
                    value={row.course}
                    onChange={e => onFieldChange(row.id, 'course', e.target.value)}
                />
            )
        },
        {
            name: 'Units (Code)',  // New Units Code column
            selector: row => row.unitsCode,
            cell: row => (
                <input
                    type="text"
                    value={row.unitsCode}
                    onChange={e => onFieldChange(row.id, 'unitsCode', e.target.value)}
                />
            )
        },
        {
            name: 'Actions',
            cell: row => (
                <button
                    onClick={() => deleteRow(row.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded shadow transition duration-200 ease-in-out transform hover:bg-red-600 hover:scale-105 active:scale-95"
                >
                    Delete
                </button>
            )
        }
    ];

    return (
        <div className="px-4 py-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Staff</h1>
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

            {loading ? (
                <p>Loading...</p>
            ) : (
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
            )}
        </div>
    );
}
