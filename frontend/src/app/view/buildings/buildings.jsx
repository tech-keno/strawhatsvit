'use client';

import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';

export default function Buildings() {
    const [gridRows, setGridRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newRoom, setNewRoom] = useState('');
    const [isRoomPopupOpen, setIsRoomPopupOpen] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState(null);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/documents/building')
            .then(response => response.json())
            .then(data => {
                const updatedData = data.map(item => ({
                    ...item,
                    rooms: Array.isArray(item.rooms) ? item.rooms : item.rooms.split(', ') 
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
            id: `building${gridRows.length + 1}`,
            name: '',
            capacity: '',
            rooms: [], 
            campus: ''
        };
        setGridRows([...gridRows, newRow]);
    };

    const deleteRow = (rowId) => {
        fetch(`http://127.0.0.1:5000/document/building/${rowId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                setGridRows(gridRows.filter(row => row.id !== rowId));
            } else {
                alert('Failed to delete document');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    const saveData = () => {
        const updatedGridRows = gridRows.map(row => ({
            ...row,
            rooms: Array.isArray(row.rooms) ? row.rooms : row.rooms.split(', ')
        }));

        fetch('http://127.0.0.1:5000/document/building', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedGridRows),
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

    const handleAddSubItem = () => {
        if (newRoom.trim() === '') {
            alert('Room name cannot be empty.');
            return;
        }

        const updatedRows = gridRows.map(row => {
            if (row.id === selectedRowId) {
                return {
                    ...row,
                    rooms: [...row.rooms, newRoom]
                };
            }
            return row;
        });

        setGridRows(updatedRows);
        setNewRoom('');
        setIsRoomPopupOpen(false);
    };

    const handleRemoveSubItem = (rowId, roomIndex) => {
        const updatedRows = gridRows.map(row => {
            if (row.id === rowId) {
                const updatedRooms = row.rooms.filter((_, i) => i !== roomIndex);
                return { ...row, rooms: updatedRooms };
            }
            return row;
        });

        setGridRows(updatedRows);
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
                <div>
                    {Array.isArray(row.rooms) && row.rooms.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">  {/* Adjusted gap for sub-items */}
                            {row.rooms.map((room, index) => (
                                <span key={index} className="room-item flex items-center">
                                    {room}
                                    <button
                                        onClick={() => handleRemoveSubItem(row.id, index)}
                                        className="ml-2 text-red-500"
                                    >
                                        x
                                    </button>
                                </span>
                            ))}
                        </div>
                    ) : (
                        <span>No rooms added</span>
                    )}
                    <div className="mt-2"> {/* Reduced vertical spacing */}
                        <button
                            onClick={() => {
                                setSelectedRowId(row.id);
                                setIsRoomPopupOpen(true);
                            }} 
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-1"
                        >
                            Add Room
                        </button>
                    </div>
                </div>
            ),
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

            {/* Popup Window */}
            {isRoomPopupOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-md max-h-[80vh] overflow-y-auto z-60">
                        <h2 className="text-2xl font-bold mb-4">Add New Room</h2>
                        <input
                            type="text"
                            value={newRoom}
                            onChange={(e) => setNewRoom(e.target.value)}
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                            placeholder="Enter room name"
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={handleAddSubItem}
                                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                            >
                                Add
                            </button>
                            <button
                                onClick={() => setIsRoomPopupOpen(false)}
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
