import React from 'react';
import { Typography, Box } from '@mui/material';
import styles from '../theme-information/theme-information.module.scss';

export interface LessonProps {
    theme: any;
}

const AssignedLessons: React.FC<LessonProps> = ({ theme }) => {
    const { lessons } = theme;

    return (
        <Box className={styles.assignedLessons}>
            <Typography variant="h6">Lessons assigned</Typography>
            {lessons &&
                lessons.length > 0 &&
                lessons.map((lesson: any, index: any) => (
                    <Box key={index} className={styles.lessonBox}>
                        <Typography variant="body1" className={styles.lessonTitle}>
                            {lesson.name || 'N/A'}
                        </Typography>
                    </Box>
                ))}
        </Box>
    );
};

export default AssignedLessons;
