import React from 'react';
import { Box, Paper, Grid, Typography } from '@mui/material';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { Deck } from './Deck';
import { ProtocolSteps } from './ProtocolSteps';
import { ResourcePalette } from './ResourcePalette';
import { useExperimentStore } from '../stores/experimentStore';

export const ExperimentBuilder: React.FC = () => {
  const { addResource } = useExperimentStore();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.data.current?.type === 'resource') {
      const position = {
        x: over.rect.left,
        y: over.rect.top,
        z: 0
      };
      
      addResource({
        type: active.data.current.resourceType,
        name: `${active.data.current.resourceType}_${Date.now()}`,
        position
      });
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              Experiment Builder
            </Typography>
          </Grid>
          
          <Grid item xs={3}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <ResourcePalette />
            </Paper>
          </Grid>
          
          <Grid item xs={6}>
            <Paper sx={{ p: 2, height: 600 }}>
              <Deck />
            </Paper>
          </Grid>
          
          <Grid item xs={3}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <ProtocolSteps />
            </Paper>
          </Grid>
        </Grid>
      </DndContext>
    </Box>
  );
};
