import React, { useState } from 'react';
import TabBar from '../../../../../content/content-components/tab-bar/TabBar';
import styles from './AssignedThemes.module.scss';
import { Typography } from '@mui/material';
import { ThemesTable } from '../../../../../content/themes/themes-components/themes-table/themes-table';
import { Lesson } from '../../../../../content/themes/themes-components/lessonsidebar/lessonSidebar';

export interface AssignedThemesProps {
    className?: string;
    plan: any;
}
const AssignedThemes = ({ className, plan }: AssignedThemesProps) => {
    const tabs = ['All themes', 'Mental wellbeing', 'Nutrition', 'Physical activity'];
    console.log('plan', plan);
    const [selectedTab, setSelectedTab] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleTabChange = (newValue: number) => {
        setSelectedTab(newValue);
    };
    return (
        <>
            <div className={styles['container-header']}>
                <header className={styles['container-header-title']}>
                    <Typography variant="h5">Themes in this Lifestyle plan</Typography>
                </header>
            </div>
            <div>
                <TabBar tabs={tabs} selectedTab={selectedTab} onTabChange={handleTabChange} />
                <ThemesTable
                    themes={plan.themes}
                    setThemes={undefined}
                    currentPage={1} 
                    totalPages={0}
                    setTotalPages={undefined}
                    totalRecords={0}
                    setTotalRecords={undefined}
                    onPageChange={handlePageChange} 
                    onUpdateThemes={function (updatedLessons: Lesson[]): void {
                        throw new Error('Function not implemented.');
                    }}
                />
            </div>
        </>
    );
};

export default AssignedThemes;
