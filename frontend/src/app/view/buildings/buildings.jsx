'use client';

import React, { useState } from 'react';
import DataTable from 'react-data-table-component';

export default function Buildings() {
    const initialRows = [
        { id: 'building1', name: 'Building A', capacity: '100', rooms: '10' }
    ];

    const [gridRows, setGridRows] = useState(initialRows);

    const onFieldChange = (rowId, field, value) => {
        const updatedRows = gridRows.map(row =>
            row.id === rowId ? { ...row, [field]: value } : row
        );
        setGridRows(updatedRows);
    };

    const addRow = () => {
        const newRow = {
            id: `building${gridRows.length + 1}`,
            name: '',
            capacity: '',
            rooms: ''
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

    const columns = [
        {
            name: 'Building Name',
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
            name: 'Capacity',
            selector: row => row.capacity,
            cell: row => (
                <input
                    type="text"
                    value={row.capacity}
                    onChange={e => onFieldChange(row.id, 'capacity', e.target.value)}
                />
            )
        },
        {
            name: 'Rooms',
            selector: row => row.rooms,
            cell: row => (
                <input
                    type="text"
                    value={row.rooms}
                    onChange={e => onFieldChange(row.id, 'rooms', e.target.value)}
                />
            )
        }
    ];

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Buildings</h1>
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
