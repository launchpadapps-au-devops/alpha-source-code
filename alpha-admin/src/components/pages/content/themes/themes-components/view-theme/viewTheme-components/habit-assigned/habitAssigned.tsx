import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import styles from './habitAssigned.module.scss';
interface HabitAssignedProps {
  habitName: string;
  timeAllocation: string;
  pointsAllocation: string;
  habitInstruction: string;
}

export const HabitAssigned: React.FC<HabitAssignedProps> = ({
  habitName,
  timeAllocation,
  pointsAllocation,
  habitInstruction,
}) => {
  return (
    <Paper className={styles.habitAssignedContainer}>
      <Box p={2}>
        <Typography variant="h6" gutterBottom>
          Habit assigned
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">Habit name</Typography>
            <Typography variant="body2">{habitName}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">Time allocation</Typography>
            <Typography variant="body2">{timeAllocation}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">Points allocation</Typography>
            <Typography variant="body2">{pointsAllocation}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">Habit instruction</Typography>
            <Typography variant="body2">{habitInstruction}</Typography>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

