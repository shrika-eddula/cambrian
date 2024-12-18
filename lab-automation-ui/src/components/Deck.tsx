import React from 'react';
import { Box, Typography } from '@mui/material';
import { useDroppable } from '@dnd-kit/core';
import { useExperimentStore } from '../stores/experimentStore';
import { Resource } from './Resource';

export const Deck: React.FC = () => {
  const { resources } = useExperimentStore();
  const { setNodeRef } = useDroppable({
    id: 'deck',
  });

  return (
    <Box ref={setNodeRef} sx={{ height: '100%', position: 'relative', border: '1px dashed grey' }}>
      <Typography variant="h6" gutterBottom>
        Deck Layout
      </Typography>
      
      {Object.entries(resources).map(([name, resource]) => (
        <Resource
          key={name}
          name={name}
          type={resource.type}
          position={resource.position}
        />
      ))}
    </Box>
  );
};
