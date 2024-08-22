import React from 'react';
import { useDrag } from 'react-dnd';

function DragItem({ name }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'ITEM',
    item: { name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {name}
    </div>
  );
}

export default DragItem;
