import React from 'react';
import { Typography, Box, TextField } from '@mui/material';
import styles from './assignedlessons.module.scss';

const AssignedLessons = () => {
  return (
    <Box className={styles.assignedLessons}>
      <Typography variant="h6">Lessons Assigned</Typography>
      <Box mb={2} width="100%">
        <TextField label="Lesson 1" variant="outlined" fullWidth />
      </Box>
      <Box mb={2} width="100%">
        <TextField label="Lesson 2" variant="outlined" fullWidth />
      </Box>
      <Box width="100%">
        <TextField label="Lesson 3" variant="outlined" fullWidth />
      </Box>
    </Box>
  );
};

export default AssignedLessons;
