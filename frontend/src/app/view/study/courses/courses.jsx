'use client';

import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';

export default function Courses() {
    const [gridRows, setGridRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newUnit, setNewUnit] = useState('');
    const [isUnitPopupOpen, setIsUnitPopupOpen] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState(null);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/documents/courses')
            .then(response => response.json())
            .then(data => {
                // Ensure units is an array
                const updatedData = data.map(item => ({
                    ...item,
                    units: Array.isArray(item.units) ? item.units : item.units.split(', ')
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
            id: `course${Date.now()}`, // Unique id based on timestamp
            courseName: '',
            studentsEnrolled: '',
            units: [],
        };
        setGridRows([...gridRows, newRow]);
    };

    const deleteRow = (rowId) => {
        fetch(`http://127.0.0.1:5000/document/courses/${rowId}`, {
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
        fetch('http://127.0.0.1:5000/document/courses', {
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

    const handleAddUnit = () => {
        if (newUnit.trim() === '') {
            alert('Unit name cannot be empty.');
            return;
        }

        const updatedRows = gridRows.map(row => {
            if (row.id === selectedRowId) {
                return {
                    ...row,
                    units: [...row.units, newUnit],
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
                const updatedUnits = row.units.filter((_, i) => i !== unitIndex);
                return { ...row, units: updatedUnits };
            }
            return row;
        });

        setGridRows(updatedRows);
    };

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
            ),
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
            ),
        },
        {
            name: 'Units (Code)',
            selector: row => row.units,
            cell: row => (
                <div>
                    {Array.isArray(row.units) && row.units.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2"> {/* Adjusted gap for sub-items */}
                            {row.units.map((unit, index) => (
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
                    <div className="mt-2"> {/* Reduced vertical spacing */}
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
            ),
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
                                className="bg-gray-300 text-black px-4 py-2 rounded"
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
