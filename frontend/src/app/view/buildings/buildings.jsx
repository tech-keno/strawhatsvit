'use client'

import React, { useState } from 'react'
import { Grid, Input, Select } from 'react-spreadsheet-grid'

export default function Buildings() {
    // Example initial rows
    const initialRows = [
        { id: 'user1', name: 'John Doe', positionId: 'position1', managerId: 'manager1' },
        { id: 'user2', name: 'Jane Doe', positionId: 'position2', managerId: 'manager2' }
    ];

    // Example positions (you may define your real positions list)
    const somePositions = [
        { id: 'position1', name: 'Manager' },
        { id: 'position2', name: 'Developer' },
        { id: 'position3', name: 'Designer' }
    ];

    // Example managers (you may define your real managers list)
    const someManagers = [
        { id: 'manager1', name: 'Alice Johnson' },
        { id: 'manager2', name: 'Bob Smith' }
    ];

    const MyAwesomeGrid = () => {
        // Rows are stored in the state.
        const [gridRows, setGridRows] = useState(initialRows);

        // A callback called every time a value is changed.
        const onFieldChange = (rowId, field) => (value) => {
            // Find the row that is being changed
            const updatedRows = gridRows.map(row => 
                row.id === rowId ? { ...row, [field]: value } : row
            );
            setGridRows(updatedRows);
        };

        const initColumns = () => [
          {
            title: () => 'Name',
            value: (row, { focus }) => {
              // You can use the built-in Input.
              return (
                <Input
                  value={row.name}
                  focus={focus}
                  onChange={e => onFieldChange(row.id, 'name')(e.target.value)}
                />
              );
            }
          }, {
            title: () => 'Position',
            value: (row, { focus }) => {
                // You can use the built-in Select.
                return (
                    <Select
                      value={row.positionId}
                      isOpen={focus}
                      items={somePositions}
                      onSelect={item => onFieldChange(row.id, 'positionId')(item.id)}
                      renderItem={item => item.name}
                    />
                );
            }
          }, {
            title: () => 'Manager',
            value: (row, { focus }) => {
              // You can use any component for autocomplete, this is just a placeholder.
              return (
                <Select
                  value={row.managerId}
                  isOpen={focus}
                  items={someManagers}
                  onSelect={item => onFieldChange(row.id, 'managerId')(item.id)}
                  renderItem={item => item.name}
                />
              );
            }
          }
        ];

        // Placeholder for column resize event, if needed
        const onColumnResize = (column, newWidth) => {
            console.log(`Column resized: ${column}, New width: ${newWidth}`);
        };

        return (
            <Grid
                columns={initColumns()}
                rows={gridRows}
                isColumnsResizable
                onColumnResize={onColumnResize}
                getRowKey={row => row.id}
            />
        );
    };

    return (
        <div>
            <h1>Buildings Grid</h1>
            <MyAwesomeGrid />
        </div>
    );
}
