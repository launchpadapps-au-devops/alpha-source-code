import { useEffect, useState } from 'react';
import styles from './createLifestyle.module.scss';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AppButton } from '../../../../app-button/app-button';
import { EditButton } from '../../../content/content-components/edit-button/edit-button';
import { AddThemeDetails } from '../../../content/themes/themes-components/create-theme/create-theme-components/add-theme-details/addThemeDetails';
import { LessonManagement } from '../../../content/themes/themes-components/create-theme/create-theme-components/lessonManagement/lessonManagement';
import { Vector } from '../../../../icon/glyps/vector';
import { DeleteButton } from '../../../content/content-components/delete-button/delete-button';
import Habit from '../../../content/themes/themes-components/create-theme/create-theme-components/habit/habit';
import classNames from 'classnames';
import { NewLifestyle } from './new-lifestyle/newLifestyle';
import { useAppDispatch } from '../../../../../app/hooks';
import { addPlanThunk, fetchPlanByIdThunk, updatePlanThunk } from '../lifeStyleSlice';
import { fetchThemesThunk } from '../../../content/themes/themes-components/themeSlice';
import { AddThemes } from '../add-themes/addThemes';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { BackButton } from '../../../../back-button/backButton';
import React from 'react';

export interface CreateLifestyleProps {
    className?: string;
}

export const CreateLifestyle = ({ className }: CreateLifestyleProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [category, setCategory] = useState<string>('');
    const [showHabit, setShowHabit] = useState(false);
    const [themeView, setThemeView] = useState(false);
    const { id } = useParams();

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

    const [internalNotes, setInternalNotes] = useState('');
    const [planName, setPlanName] = useState('');
    const [planDescription, setPlanDescription] = useState('');
    const dispatch = useAppDispatch();
    const [themes, setThemes] = useState([]);
    const [selectedThemes, setSelectedThemes] = useState<any>([]);
    const [errors, setErrors] = React.useState<any>({});
    console.log('selectedThemes', selectedThemes);

    const onUpdateThemes = (theme: any) => {
        if (selectedThemes.includes(theme.id)) {
            setSelectedThemes(selectedThemes.filter((id: any) => id !== theme.id));
        } else {
            setSelectedThemes([...selectedThemes, theme.id]);
        }
        console.log('Updated selectedThemes:', selectedThemes);
    };
    
    // console.log('Updated selectedThemes:', selectedThemes);

    const isEditMode = location.pathname.includes('/lifestyle-plan/edit');

    useEffect(() => {
        if (isEditMode) {
            console.log('edit');
            dispatch(fetchPlanByIdThunk(id)).then((data: any) => {
                if (data.payload) {
                    console.log('data', data.payload.data);
                    const plan = data.payload.data.data;
                    setPlanName(plan.name);
                    setPlanDescription(plan.description);
                    setInternalNotes(plan.internalNotes);
                    setSelectedThemes(plan.themes.map((theme: any) => theme.id));
                }
            });

            // setThemeView(true);
        }
        dispatch(fetchThemesThunk(1)).then((data: any) => {
            if (data.payload) {
                console.log('data', data.payload.data);
                setThemes(data.payload.data);
            }
        });
    }, []);

    const validateFields = () => {
        let fieldErrors: any = {};
        if (!planName) {
            fieldErrors.planName = 'Please enter the plan name';
        }
        if (!planDescription) {
            fieldErrors.planDescription = 'Please enter the plan description';
        }
        if (!internalNotes) {
            fieldErrors.internalNotes = 'Please enter the internal notes';
        }
        // if (selectedThemes.length === 0) {
        //     fieldErrors.selectedThemes = 'Please select at least one theme';
        // }

        setErrors(fieldErrors);

        return Object.keys(fieldErrors).length === 0;
    };

    const handleSubmit = () => {
        const data = {
            planData: {
                planCode: Math.random().toString().slice(2, 6),
                name: planName,
                image: 'https://sample.com/sample.jpg',
                description: planDescription,
                internalNotes: internalNotes,
                status: 'ACTIVE',
                isPublished: false,
            },
            themes: selectedThemes,
        };

        console.log('final data', data);
    
        // Run validation first
        // if (!validateFields()) {
            if (isEditMode) {
                // Call updatePlanThunk and handle promise result
                dispatch(updatePlanThunk({ id: id, plan: data }))
                    .then((response: any) => {
                        if (response.meta.requestStatus === "fulfilled") {
                            navigate('/lifestyle-plan'); // Navigate only on success
                        } else if (response.meta.requestStatus === "rejected") {
                            handleAPIError(response.error); // Only handle error if rejected
                        }
                    })
                    .catch((err: any) => {
                        console.log('Error during update:', err);
                    });
            } else {
                // Call addPlanThunk and handle promise result
                dispatch(addPlanThunk(data))
                    .then((response: any) => {
                        if (response.meta.requestStatus === "fulfilled") {
                            navigate('/lifestyle-plan'); // Navigate only on success
                        } else if (response.meta.requestStatus === "rejected") {
                            handleAPIError(response.error); // Only handle error if rejected
                        }
                    })
                    .catch((err: any) => {
                        console.log('Error during add plan:', err);
                    });
            }
        // } 
        // else {
        //     // Validation failed, show errors
        //     console.log('Validation failed', errors);
        // }
    };
    
    const handleAPIError = (error: any) => {
        if (error?.code === 400 && error.message === "Unique constraint violation error") {
            // Handle specific unique constraint violation error
            console.error("Unique constraint violation:", error.message);
            alert("A plan with the same unique field (e.g., planCode or name) already exists.");
        } else {
            console.error("API error:", error?.message);
        }
    };
    
    
    

    const handleDelete = () => {
        const data = {
            planData: {
                planCode: Math.random().toString().slice(2, 6),
                name: planName,
                image: 'https://sample.com/sample.jpg',
                description: planDescription,
                internalNotes: internalNotes,
                status: 'ARCHIVE',
                isPublished: false,
            },
            themes: selectedThemes,
        };
        dispatch(updatePlanThunk({ id: id, plan: data })).then(() => {
            navigate('/lifestyle-plan');
        });
    };

    const handleBackClick = () => {
        navigate(-1); // This will navigate to the previous page
    };

    return (
        <>
            <BackButton onClick={handleBackClick} />
            {!themeView ? (
                <div className={classNames(styles.container, className)}>
                    <div className={styles.content}>
                        <header className={styles.header}>
                            <h4>
                                {isEditMode ? 'Edit Lifestyle Plan' : 'Create new Lifestyle plan'}
                            </h4>
                            <div className={styles.leftButtonContainer}>
                                {isEditMode && (
                                    <DeleteButton
                                        showLeftIcon
                                        onButtonClick={() => handleDelete()}
                                    />
                                )}{' '}
                                <EditButton
                                    buttonText="Cancel"
                                    onButtonClick={() => navigate('/lifestyle-plan')}
                                />
                            </div>
                            <div className={styles.rightButtonContainer}>
                                <EditButton
                                    buttonText="Save as draft"
                                    onButtonClick={() => handleSubmit()}
                                />
                                <AppButton
                                    buttonText="Preview"
                                    onButtonClick={() => handleSubmit()}
                                />
                            </div>
                        </header>
                        <div className={styles.themeContainer}>
                            <div className={styles.rightColumn}>
                                <NewLifestyle
                                    internalNotes={internalNotes}
                                    setInternalNotes={setInternalNotes}
                                    planName={planName}
                                    setPlanName={setPlanName}
                                    planDescription={planDescription}
                                    setPlanDescription={setPlanDescription}
                                    errors={errors}
                                    setErrors={setErrors}
                                />
                                <div className={styles.ButtonContainer}>
                                    <EditButton
                                        buttonText="Continue"
                                        onButtonClick={() => setThemeView(true)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <AddThemes
                    themes={themes}
                    onUpdateThemes={onUpdateThemes}
                    setThemeView={setThemeView}
                    errors={errors}
                    setErrors={setErrors}
                />
            )}
        </>
    );
};
