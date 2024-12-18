import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useDraggable } from '@dnd-kit/core';

const resourceTypes = [
  { id: 'plate96', name: '96-Well Plate' },
  { id: 'tiprack', name: 'Tip Rack' },
];

const DraggableResource: React.FC<{ type: string; name: string }> = ({ type, name }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `palette-${type}`,
    data: {
      type: 'resource',
      resourceType: type,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <Paper
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      sx={{
        width: '100%',
        p: 2,
        mb: 1,
        cursor: 'grab',
        backgroundColor: type === 'plate96' ? '#e3f2fd' : '#f3e5f5',
        '&:hover': {
          opacity: 0.8,
        },
      }}
      style={style}
    >
      <Typography variant="body2">{name}</Typography>
    </Paper>
  );
};

export const ResourcePalette: React.FC = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Resources
      </Typography>
      {resourceTypes.map((resource) => (
        <DraggableResource
          key={resource.id}
          type={resource.id}
          name={resource.name}
        />
      ))}
    </Box>
  );
};
