'use client';

import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';

export default function Students() {
    const [gridRows, setGridRows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/documents/students')
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
            courseEnrolled: ''
        };
        setGridRows([...gridRows, newRow]);
    };

    const saveData = () => {
        fetch('http://127.0.0.1:5000/document/students', {
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
                fetch('http://127.0.0.1:5000/documents/students')
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
                <h1 className="text-2xl font-bold">Students</h1>
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