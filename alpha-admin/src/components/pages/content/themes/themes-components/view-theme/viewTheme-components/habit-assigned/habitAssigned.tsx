import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import styles from './habitAssigned.module.scss';

interface HabitAssignedProps {
    theme: any;
}

export const HabitAssigned: React.FC<HabitAssignedProps> = ({ theme }) => {
    console.log('eee', theme);
    const habit = (theme.habits && theme.habits[0]) || {}; // Assuming we're showing the first habit
    const {
        name: habitName,
        timeAllocation,
        pointAllocation,
        instruction: habitInstruction,
    } = habit;

    return (
        <Paper className={styles.habitAssignedContainer}>
            <Box p={2}>
                <Typography variant="h6" gutterBottom>
                    Habit assigned
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1">Habit name</Typography>
                        <Typography variant="body2">{habitName || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1">Time allocation</Typography>
                        <Typography variant="body2">{timeAllocation || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1">Points allocation</Typography>
                        <Typography variant="body2">{pointAllocation || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">Habit instruction</Typography>
                        <Typography variant="body2">{habitInstruction || 'N/A'}</Typography>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default HabitAssigned;
