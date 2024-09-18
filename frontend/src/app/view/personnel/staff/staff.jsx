'use client';

import React, { useState } from 'react';
import DataTable from 'react-data-table-component';

export default function Staff() {
    // Initial rows structure:  ID, Name, Units Taught
    const initialRows = [
        { id: 'person1', idNumber: 'S123', name: 'Jane Doe', unitsTaught: 'N/A' }
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
            idNumber: '',
            name: '',
            unitsTaught: ''
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
            name: 'Units Taught',
            selector: row => row.unitsTaught,
            cell: row => (
                <input
                    type="text"
                    value={row.unitsTaught}
                    onChange={e => onFieldChange(row.id, 'unitsTaught', e.target.value)}
                />
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
