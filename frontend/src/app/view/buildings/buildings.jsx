'use client';

import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';

export default function Buildings() {
    const [gridRows, setGridRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newRoom, setNewRoom] = useState(''); // For new room input
    const [isRoomPopupOpen, setIsRoomPopupOpen] = useState(false); // To toggle popup
    const [selectedRowId, setSelectedRowId] = useState(null); // To know which row's rooms are being added

    useEffect(() => {
        // Fetch data from the backend
        fetch('http://127.0.0.1:5000/documents/building')
            .then(response => response.json())
            .then(data => {
                const updatedData = data.map(item => ({
                    ...item,
                    rooms: Array.isArray(item.rooms) ? item.rooms : item.rooms.split(', ') // Ensure rooms is an array
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
            rooms: [], // Initialize rooms as an empty array
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
        const updatedGridRows = gridRows.map(row => ({
            ...row,
            rooms: Array.isArray(row.rooms) ? row.rooms : row.rooms.split(', ') // Ensure rooms are saved as an array
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

    // Function to handle room addition for a specific row
    const handleAddRoom = () => {
        if (newRoom.trim() === '') {
            alert('Room name cannot be empty.');
            return;
        }

        const updatedRows = gridRows.map(row => {
            if (row.id === selectedRowId) {
                return {
                    ...row,
                    rooms: [...row.rooms, newRoom] // Add new room to the specific row's rooms array
                };
            }
            return row;
        });

        setGridRows(updatedRows);
        setNewRoom(''); // Clear the input field
        setIsRoomPopupOpen(false); // Close the popup
    };

    // Function to remove a room
    const handleRemoveRoom = (rowId, roomIndex) => {
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
                        row.rooms.map((room, index) => (
                            <span key={index} className="room-item">
                                {room}
                                <button 
                                    onClick={() => handleRemoveRoom(row.id, index)} 
                                    className="ml-2 text-red-500"
                                >
                                    x
                                </button>
                            </span>
                        ))
                    ) : (
                        <span>No rooms added</span>
                    )}
                    <button
                        onClick={() => {
                            setSelectedRowId(row.id);
                            setIsRoomPopupOpen(true);
                        }} 
                        className="ml-2 text-blue-500"
                    >
                        Add Room
                    </button>
                </div>
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

            {/* Room Popup */}
            {isRoomPopupOpen && (
                <div className="popup">
                    <div className="popup-inner">
                        <h3>Add Room</h3>
                        <input 
                            type="text" 
                            value={newRoom}
                            onChange={e => setNewRoom(e.target.value)}
                            placeholder="Enter room name"
                            className="border p-2"
                        />
                        <div className="mt-4">
                            <button onClick={handleAddRoom} className="px-4 py-2 bg-blue-500 text-white rounded shadow">Add</button>
                            <button onClick={() => setIsRoomPopupOpen(false)} className="ml-2 px-4 py-2 bg-gray-500 text-white rounded shadow">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
