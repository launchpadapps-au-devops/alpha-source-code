import classNames from 'classnames';
import { Box, Typography, Button, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tabs, Tab } from '@mui/material';
import styles from './viewTheme.module.scss';
import { AppButton } from '../../../../../app-button/app-button';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../../content-components/sidebar/Sidebar';
import { useState } from 'react';
import ThemeInformation from './viewTheme-components/theme-information/theme-information';
import AssignedLessons from './viewTheme-components/theme-tags/themeTags';
import { HabitAssigned } from './viewTheme-components/habit-assigned/habitAssigned';
import { EditButton } from '../../../content-components/edit-button/edit-button';
import { PublishButton } from '../../../content-components/publish-button/publishButton';

export interface ContentProps {
    className?: string;
}

export const ViewThemes = ({ className }: ContentProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isPublished } = location.state || {};
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className={classNames(styles.container, className, { 'blur-effect': isSidebarOpen })}>
            <Sidebar />
            <div className={styles.content}>
                <header className={styles.header}>
                    <div className={styles.leftButtonContainer}>
                        <Typography variant="h5">View themes</Typography>
                        {isPublished ? (
                            <PublishButton buttonText='Published'/>
                        ) : (
                            <PublishButton buttonText='Unpublished' isUnpublished/>
                        )}
                    </div>
                    <div className={styles.rightButtonContainer}>
                        <div className={styles.buttonContainer}>
                            <EditButton showLeftIcon buttonText="Edit" onButtonClick={() => navigate('/content/editTheme')}/>
                            {!isPublished && <AppButton buttonText="Publish" onButtonClick={() => navigate('/careteam/createcontent')} />}
                        </div>
                    </div>
                </header>
                <ThemeInformation
                    themeLevel="1"
                    category="Sleep"
                    themeName="Sleep 101"
                    themeDescription="Mastering Sleep 101 is a transformative theme designed to help individuals achieve optimal sleep health and wellness. Participants will learn evidence-based strategies and practical techniques to enhance their sleep hygiene, leading to better overall health and well-being."
                    internalNotes="Internal notes go here"
                />
                <AssignedLessons/>
                <HabitAssigned
                    habitName="Nutrition 101"
                    timeAllocation="3 weeks"
                    pointsAllocation="Nutrition 101"
                    habitInstruction="Set a nightly screen curfew at least 30 minutes before bedtime. Avoid using devices like phones, tablets, and computers during this time to reduce exposure to blue light, which can disrupt sleep. Opt for relaxing activities instead, like reading, bathing, or listening to calming music."
                />
            </div>
        </div>
    );
};
