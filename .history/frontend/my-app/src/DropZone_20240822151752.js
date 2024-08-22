import React from 'react';
import { useDrop } from 'react-dnd';

function DropZone({ onDrop }) {
  const [{ isOver }, drop] = useDrop({
    accept: 'ITEM',
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div ref={drop} style={{ 
      height: '100px', 
      width: '200px', 
      border: '1px dashed black', 
      backgroundColor: isOver ? 'lightgreen' : 'white'
    }}>
      {isOver ? 'Release to drop' : 'Drag item here'}
    </div>
  );
}

export default DropZone;
