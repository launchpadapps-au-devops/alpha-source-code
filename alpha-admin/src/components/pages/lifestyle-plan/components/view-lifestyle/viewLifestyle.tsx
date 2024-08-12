import classNames from 'classnames';
import { Typography } from '@mui/material';
import styles from './viewLifestyle.module.scss';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from '../../../content/content-components/sidebar/Sidebar';
import { PublishButton } from '../../../content/content-components/publish-button/publishButton';
import { EditButton } from '../../../content/content-components/edit-button/edit-button';
import { AppButton } from '../../../../app-button/app-button';
import LifestyleInformation from './viewLifestyle-components/lifestyle-information/lifestyle-information';
import AssignedThemes from './viewLifestyle-components/assigned-themes/AssignedThemes';

export interface ContentProps {
    className?: string;
}

export const ViewLifeStyle = ({ className }: ContentProps) => {
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
                        <Typography variant="h5">Lifestyle plan</Typography>
                        {isPublished ? (
                            <PublishButton buttonText="Published" />
                        ) : (
                            <PublishButton buttonText="Unpublished" isUnpublished />
                        )}
                    </div>
                    <div className={styles.rightButtonContainer}>
                        <div className={styles.buttonContainer}>
                            {!isPublished && (
                                <AppButton
                                    buttonText="Publish"
                                    onButtonClick={() => navigate('/careteam/createcontent')}
                                />
                            )}

                            <EditButton
                                showLeftIcon
                                buttonText={
                                    isPublished == true ? 'Edit Plan' : 'Edit Lifestyle plan'
                                }
                                onButtonClick={() => navigate('/lifestyle/edit')}
                            />
                        </div>
                    </div>
                </header>
                <LifestyleInformation
                    planName="Heart health"
                    planDuration="90 Days"
                    planDescription="Heart health is a transformative theme designed to help individuals achieve optimal heart health and wellness. Participants will learn evidence-based strategies and practical techniques to enhance their heart health, leading to better overall health and well-being."
                    internalNotes="Internal notes go here"
                />
                <AssignedThemes />
            </div>
        </div>
    );
};
