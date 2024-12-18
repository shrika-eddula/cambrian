import React from 'react';
import { Paper, Typography } from '@mui/material';
import { useDraggable } from '@dnd-kit/core';

interface ResourceProps {
  name: string;
  type: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
}

export const Resource: React.FC<ResourceProps> = ({ name, type, position }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: name,
    data: {
      type: 'placed-resource',
      name,
      resourceType: type,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : {
    position: 'absolute',
    left: position.x,
    top: position.y,
  };

  return (
    <Paper
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      sx={{
        ...style,
        width: 100,
        height: 150,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'move',
        backgroundColor: type === 'plate96' ? '#e3f2fd' : '#f3e5f5',
      }}
    >
      <Typography variant="body2">{type}</Typography>
      <Typography variant="caption">{name}</Typography>
    </Paper>
  );
};
