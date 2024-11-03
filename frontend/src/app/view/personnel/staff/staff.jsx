'use client';

import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';

export default function Staff() {
    const [gridRows, setGridRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newUnit, setNewUnit] = useState('');
    const [isUnitPopupOpen, setIsUnitPopupOpen] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState(null);

    useEffect(() => {
        fetch('https://strawhatsvit-3.onrender.com/documents/staff')
            .then(response => response.json())
            .then(data => {
                // Ensure unitsCode is initialized as an array
                const updatedData = data.map(item => ({
                    ...item,
                    unitsCode: Array.isArray(item.unitsCode) ? item.unitsCode : [],
                }));
                setGridRows(updatedData);
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
            campus: '',
            course: '',
            unitsCode: [],
        };
        setGridRows([...gridRows, newRow]);
    };

    const deleteRow = (rowId) => {
        fetch(`https://strawhatsvit-3.onrender.com/document/staff/${rowId}`, {
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
        fetch('https://strawhatsvit-3.onrender.com/document/staff', {
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
                fetch('https://strawhatsvit-3.onrender.com/documents/staff')
                    .then(response => response.json())
                    .then(data => {
                        const updatedData = data.map(item => ({
                            ...item,
                            unitsCode: Array.isArray(item.unitsCode) ? item.unitsCode : [],
                        }));
                        setGridRows(updatedData);
                    });
            } else {
                alert('Failed to save data');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    const handleAddUnit = () => {
        if (newUnit.trim() === '') {
            alert('Unit name cannot be empty.');
            return;
        }

        const updatedRows = gridRows.map(row => {
            if (row.id === selectedRowId) {
                return {
                    ...row,
                    unitsCode: [...(row.unitsCode || []), newUnit],
                };
            }
            return row;
        });

        setGridRows(updatedRows);
        setNewUnit('');
        setIsUnitPopupOpen(false);
    };

    const handleRemoveUnit = (rowId, unitIndex) => {
        const updatedRows = gridRows.map(row => {
            if (row.id === rowId) {
                const updatedUnits = row.unitsCode.filter((_, i) => i !== unitIndex);
                return { ...row, unitsCode: updatedUnits };
            }
            return row;
        });

        setGridRows(updatedRows);
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
            name: 'Campus',
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
            name: 'Course',
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
            name: 'Units (Code)',  // Units (Code) column
            selector: row => row.unitsCode,
            cell: row => (
                <div>
                    {Array.isArray(row.unitsCode) && row.unitsCode.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                            {row.unitsCode.map((unit, index) => (
                                <span key={index} className="unit-item flex items-center">
                                    {unit}
                                    <button
                                        onClick={() => handleRemoveUnit(row.id, index)}
                                        className="ml-2 text-red-500"
                                    >
                                        x
                                    </button>
                                </span>
                            ))}
                        </div>
                    ) : (
                        <span>No units added</span>
                    )}
                    <div className="mt-2">
                        <button
                            onClick={() => {
                                setSelectedRowId(row.id);
                                setIsUnitPopupOpen(true);
                            }} 
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-1"
                        >
                            Add Unit
                        </button>
                    </div>
                </div>
            ),
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

            {/* Popup Window for Adding Unit */}
            {isUnitPopupOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-md max-h-[80vh] overflow-y-auto z-60">
                        <h2 className="text-2xl font-bold mb-4">Add New Unit</h2>
                        <input
                            type="text"
                            value={newUnit}
                            onChange={(e) => setNewUnit(e.target.value)}
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                            placeholder="Enter unit name"
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={handleAddUnit}
                                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                            >
                                Add
                            </button>
                            <button
                                onClick={() => setIsUnitPopupOpen(false)}
                                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
