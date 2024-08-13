import { useState } from 'react';
import styles from './createLifestyle.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppButton } from '../../../../app-button/app-button';
import { EditButton } from '../../../content/content-components/edit-button/edit-button';
import { AddThemeDetails } from '../../../content/themes/themes-components/create-theme/create-theme-components/add-theme-details/addThemeDetails';
import { LessonManagement } from '../../../content/themes/themes-components/create-theme/create-theme-components/lessonManagement/lessonManagement';
import { Vector } from '../../../../icon/glyps/vector';
import { DeleteButton } from '../../../content/content-components/delete-button/delete-button';
import Habit from '../../../content/themes/themes-components/create-theme/create-theme-components/habit/habit';
import classNames from 'classnames';
import { NewLifestyle } from './new-lifestyle/newLifestyle';

export interface CreateLifestyleProps {
    className?: string;
}
export const CreateLifestyle = ({ className }: CreateLifestyleProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [category, setCategory] = useState<string>('');
    const [showHabit, setShowHabit] = useState(false);

    const handleOpenSidebar = () => {
        setIsSidebarOpen(true);
    };

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
    };

    const handleAddHabitClick = () => {
        setShowHabit(true);
    };

    const handleRemoveHabitClick = () => {
        setShowHabit(false);
    };
    const hideLessons = location.state?.hideLessons;

    return (
        <div className={classNames(styles.container, className)}>
            <div className={styles.content}>
                <header className={styles.header}>
                    <h4>Create new Lifestyle plan</h4>
                    <div className={styles.leftButtonContainer}>
                        <EditButton
                            buttonText="Cancel"
                            onButtonClick={() => navigate('/content/themes')}
                        />
                    </div>
                    <div className={styles.rightButtonContainer}>
                        <EditButton
                            buttonText="Save as draft"
                            onButtonClick={() => navigate('/content/categories')}
                        />
                        <AppButton
                            buttonText="Preview"
                            onButtonClick={() => navigate('/careteam/createcontent')}
                        />
                    </div>
                </header>
                <div className={styles.themeContainer}>
                    <div className={styles.rightColumn}>
                        <NewLifestyle />
                        {/* <div className={styles.section}>
                            <div className={styles.habitHeader}>
                                <h3>
                                    Habit <Vector />
                                </h3>
                                {showHabit && (
                                    <DeleteButton
                                        showLeftIcon
                                        buttonText="Remove habit"
                                        className={styles.removeHabitButton}
                                        onButtonClick={handleRemoveHabitClick}
                                    />
                                )}
                            </div>
                            {/* {showHabit ? (
                                <Habit showDeleteButton={false} />
                            ) : (
                                <EditButton
                                    buttonText="Add Habit"
                                    onButtonClick={handleAddHabitClick}
                                />
                            )} */}
                        {/* </div>  */}
                        <div className={styles.rightButtonContainer}>
                        <EditButton
                            buttonText="Continue"
                            onButtonClick={() => navigate('/lifestyle-plan/addthemes')}
                        />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
