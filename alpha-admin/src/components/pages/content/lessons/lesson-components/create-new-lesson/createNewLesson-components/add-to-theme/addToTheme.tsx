import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import styles from './addToTheme.module.scss';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import { Checkbox, TextField, InputAdornment } from '@mui/material';
import { AppButton } from '../../../../../../../app-button/app-button';
import { EditButton } from '../../../../../content-components/edit-button/edit-button';
import { useNavigate } from 'react-router-dom';
import TabBar from '../../../../../content-components/tab-bar/TabBar';

export interface Lesson {
    code: number;
    title: string;
    date: string;
    published: boolean;
    category: string;
    quiz: boolean;
    select: boolean;
}

export interface SelectThemeSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
    setData: any;
    theme: any;
    setTheme: any;
    setSelectedTheme: any;
}

export const SelectTheme: React.FC<SelectThemeSidebarProps> = ({
    isOpen,
    onClose,
    data,
    setData,
    theme,
    setTheme,
    setSelectedTheme,
}) => {
    const [localLessons, setLocalLessons] = useState<Lesson[]>([]);
    const [isAnyLessonSelected, setIsAnyLessonSelected] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedTheme, setSelectedThemeData] = useState<any>({});

    const tabs = ['All themes', 'Mental wellbeing', 'Nutrition', 'Physical activity'];
    const handleTabChange = (newValue: number) => {
        setSelectedTab(newValue);
    };

    useEffect(() => {
        const isAnyLessonSelected = localLessons.some((lesson) => lesson.select);
        setIsAnyLessonSelected(isAnyLessonSelected);
    }, [localLessons]);

    const handleCheckboxChange = (theme: any) => {
        setSelectedThemeData(theme);
        setSelectedTheme(theme);

        setData({ ...data, themeId: theme.id });
        setIsAnyLessonSelected(true);
    };

    const handleAddToThemeClick = () => {
        if (isAnyLessonSelected) {
            onClose();
        } else {
            console.log('No lesson selected');
        }
    };

    const handleRowClick = (lesson: Lesson) => {
        navigate(`/content/lessons/viewlesson/${lesson.code}`, {
            state: { showTags: false, showAlternateButtons: true },
        });
    };

    const filteredLessons = localLessons.filter((lesson) =>
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateNewTheme = () => {
        navigate('/content/themes/createtheme', { state: { hideLessons: true } });
    };

    return (
        <>
            {isOpen && <div className={styles.overlay} onClick={onClose} />}
            <div className={classNames(styles.sidebar, { [styles.open]: isOpen })}>
                <div className={styles['inner-block']}>
                    <div className={styles.floatIcon}>
                        {isOpen && (
                            <button onClick={onClose} className={styles.closeButton}>
                                <ChevronRightIcon className={styles.arrowIcon} />
                            </button>
                        )}
                    </div>
                    <div className={styles.header}>
                        <h2>Assign to theme</h2>
                        <div className={styles.rightButtonContainer}>
                            <EditButton
                                buttonText="Create new theme"
                                onButtonClick={handleCreateNewTheme}
                            />
                            <AppButton
                                buttonText="Add to theme"
                                onButtonClick={handleAddToThemeClick}
                                className={!isAnyLessonSelected ? styles.disabledButton : ''}
                            />
                        </div>
                    </div>
                    <table className={styles.lessonsTable}>
                        <thead>
                            <tr>
                                <th>Theme Code</th>
                                <th>Theme title</th>
                                <th>Habit</th>
                                <th>Published</th>
                                <th></th>
                                <th>Select</th>
                            </tr>
                        </thead>
                        <tbody>
                            {theme &&
                                theme.length > 0 &&
                                theme.map((theme: any, index: any) => (
                                    <tr key={index} onClick={() => handleRowClick(theme)}>
                                        <td>{theme.themeCode}</td>
                                        <td>{theme.name}</td>
                                        <td>{theme.description}</td>
                                        <td>{theme.published ? <CheckCircleOutlineIcon /> : ''}</td>
                                        <td>{theme.quiz ? <CheckCircleOutlineIcon /> : ''}</td>
                                        <td onClick={(event) => event.stopPropagation()}>
                                            <Checkbox
                                                checked={
                                                    selectedTheme && selectedTheme.id === theme.id
                                                }
                                                onChange={() => handleCheckboxChange(theme)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    <div className={styles.pagination}>
                        <a href="#">Next</a>
                    </div>
                </div>
            </div>
        </>
    );
};
