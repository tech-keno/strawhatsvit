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
        <div>
            <h1>Buildings Grid</h1>
            <DataTable
                columns={columns}
                data={gridRows} 
                noHeader
                pagination
            />
            <button onClick={addRow}>Add New Row</button>
        </div>
    );
}
