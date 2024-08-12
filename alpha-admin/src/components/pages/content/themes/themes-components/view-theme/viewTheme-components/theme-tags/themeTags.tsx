import React from 'react';
import { Typography, Box } from '@mui/material';
import styles from '../theme-information/theme-information.module.scss';

const lessons = [
  {
    lesson: 'Lesson 1',
    title: '1.1 What is sleep hygiene?'
  },
  {
    lesson: 'Lesson 2',
    title: '1.2 Why is sleep hygiene important'
  },
  {
    lesson: 'Lesson 3',
    title: '1.3 Setting yourself up for a good night\'s sleep'
  }
];

const AssignedLessons = () => {
  return (
    <Box className={styles.assignedLessons}>
      <Typography variant="h6">Lessons assigned</Typography>
      {lessons.map((lesson, index) => (
        <Box key={index} className={styles.lessonBox}>
          <Typography variant="body1" className={styles.lessonTitle}>{lesson.lesson}</Typography>
          <Typography variant="body2" className={styles.lessonContent}>{lesson.title}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default AssignedLessons;
