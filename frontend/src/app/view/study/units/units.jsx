'use client';

import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';

export default function Units() {
    const [gridRows, setGridRows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/documents/units')
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
            id: `unit${Date.now()}`, // Unique id based on timestamp
            unitName: '',
            prerequisites: '',
            studentsEnrolled: '',
            timeHrs: ''  // Changed from periods to timeHrs
        };
        setGridRows([...gridRows, newRow]);
    };

    const saveData = () => {
        fetch('http://127.0.0.1:5000/document/units', {
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
                fetch('http://127.0.0.1:5000/documents/units')
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
            name: 'Unit Name',
            selector: row => row.unitName,
            cell: row => (
                <input
                    type="text"
                    value={row.unitName}
                    onChange={e => onFieldChange(row.id, 'unitName', e.target.value)}
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
            name: 'Time (Hrs)',  // Changed from Periods to Time (Hrs)
            selector: row => row.timeHrs,
            cell: row => (
                <input
                    type="text"
                    value={row.timeHrs}
                    onChange={e => onFieldChange(row.id, 'timeHrs', e.target.value)}
                />
            )
        }
    ];

    return (
        <div className="px-4 py-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Units</h1>
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
