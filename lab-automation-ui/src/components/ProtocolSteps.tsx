import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useExperimentStore } from '../stores/experimentStore';

export const ProtocolSteps: React.FC = () => {
  const { steps, removeStep } = useExperimentStore();

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Protocol Steps
      </Typography>
      
      <List>
        {steps.map((step, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton edge="end" onClick={() => removeStep(index)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={`Step ${index + 1}: ${step.type}`}
              secondary={`${step.source} → ${step.target} (${step.volume}µL)`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
