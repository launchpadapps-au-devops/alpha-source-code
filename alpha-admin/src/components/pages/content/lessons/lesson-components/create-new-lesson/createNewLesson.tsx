import classNames from 'classnames';
import { Typography } from '@mui/material';
import styles from './createNewLesson.module.scss';
import { AppButton } from '../../../../../app-button/app-button';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../../content-components/sidebar/Sidebar';
import { EditButton } from '../../../content-components/edit-button/edit-button';
import { LessonInformation } from './createNewLesson-components/lessonInformation/lessonInformation';
import { InternalNotes } from './createNewLesson-components/InternalNotes/internalNotes';
import { DashboardCardDetails } from './createNewLesson-components/dashboardcarddetails/dashBoardCardDetails';
import { LessonContent } from './createNewLesson-components/lessonContent/lessonContent';
import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../../../../app/hooks';
import { fetchThemesThunk } from '../../../themes/themes-components/themeSlice';
import { fetchCategoriesThunk } from '../../../categories/category-component/categorySlice';
import { addLessonThunk, fetchLessonByIdThunk, updateLessonThunk } from '../lessonsSlice';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { BackButton } from '../../../../../back-button/backButton';
import { PreviewLessons } from './createNewLesson-components/preview-lesson/previewLesson';

export interface ContentProps {
    className?: string;
}

export const CreateNewLesson = ({ className }: ContentProps) => {
    const navigate = useNavigate();
    const [notes, setNotes] = React.useState<string>('');
    const [theme, setTheme] = React.useState([]);
    const [selectedTheme, setSelectedTheme] = React.useState([]);
    const [categories, setCategories] = React.useState([]);
    const dispatch = useAppDispatch();
    const location = useLocation();
    const [isEditMode, setIsEditMode] = React.useState(false);
    const [showPreview, setShowPreview] = React.useState(false); // For handling preview mode
    const params = useParams();
    const [errors, setErrors] = React.useState<any>({});
    const [data, setData] = React.useState({
        lessonCode: '',
        categoryId: '',
        themeId: '',
        status: 'ACTIVE',
        isPublished: true,
        duration: '',
        points: '',
        lessonTags: [
            {
                Ethnicity: [],
            },
            {
                'Leisure Preferences': [],
            },
            {
                'Dietary Restrictions': [],
            },
            {
                'Physical Limitation': [],
            },
            {
                'Physical Limitation- Follow up': [],
            },
            {
                'Unhealthy Eating Habits': [],
            },
            {
                'Motivation to Change': [],
            },
            {
                'Goals/Motivators': [],
            },
            {
                'Young Dependents': [],
            },
            {
                'Adult Dependents': [],
            },
        ],
        internalNotes: '',
        coverImage: '',
        name: '',
        description: '',
        screenData: [],
        quizData: [
            {
                quizName: '',
                userInstructions: '',
                question: '',
                type: 'single-choice',
                options: [],
                answer: [],
                min: 1,
                max: 1,
            },
        ],
    });
    const [dashboardCardDetails, setDashboardCardDetails] = React.useState<Object>({
        coverImage: '',
        lessonName: '',
        lessonDescription: '',
    });
    const [screenData, setScreenData] = React.useState([
        {
            subtitle: '',
            content: '',
        },
    ]);
    const [quizData, setQuizData] = React.useState([
        {
            quizName: '',
            question: '',
            answer: '',
            userInstructions: '',
            options: [{ option: '', isCorrect: false, id: 1 }],
            min: 1,
            max: 1,
        },
    ]);

    useEffect(() => {
        dispatch(fetchThemesThunk(1)).then((response: any) => {
            setTheme(response.payload.data);
        });
        dispatch(fetchCategoriesThunk(1))
            .then((response: any) => {
                setCategories(response.payload.data);
            })
            .catch((error: any) => {
                alert(error);
            });
    }, []);

    useEffect(() => {
        if (location.pathname.includes('editlesson')) {
            setIsEditMode(true);
            dispatch(fetchLessonByIdThunk(params.id)).then((response: any) => {
                if (response.payload.data) {
                    setData(response.payload.data);
                }
            });
        }
    }, [dispatch, params.id, location.pathname]);

    const validateFields = () => {
        let fieldErrors: any = {};
    
        // Basic validation for other fields (already exists)
        if (!data.lessonCode) {
            fieldErrors.lessonCode = 'Lesson Code is required';
        }
        if (!data.categoryId) {
            fieldErrors.categoryId = 'Category is required';
        }
        if (!data.duration) {
            fieldErrors.duration = 'Duration is required';
        }
        if (!data.points) {
            fieldErrors.points = 'Points are required';
        }
        if (!data.name) {
            fieldErrors.name = 'Lesson name is required';
        }
        if (!data.description) {
            fieldErrors.description = 'Lesson description is required';
        }
        if (!data.coverImage) {
            fieldErrors.coverImage = 'Cover image is required';
        }
    
        // Validation for Lesson Tags
        data.lessonTags.forEach((tag: any) => {
            const tagKey = Object.keys(tag)[0]; // Extract the tag key
            if (!tag[tagKey] || tag[tagKey].length === 0) {
                fieldErrors[`tag-${tagKey}`] = `${tagKey} is required`;
            }
        });
    
        // **New Validation for Lesson Content Screens**
        if (!data.screenData || data.screenData.length === 0) {
            fieldErrors['screenData'] = 'At least one screen is required';
        } else {
            data.screenData.forEach((screen: any, index: number) => {
                if (!screen.subtitle) {
                    fieldErrors[`subtitle-${index}`] = 'Subtitle is required for screen ' + (index + 1);
                }
                if (!screen.content) {
                    fieldErrors[`content-${index}`] = 'Content is required for screen ' + (index + 1);
                }
                if (!screen.media) {
                    fieldErrors[`media-${index}`] = 'Media is required for screen ' + (index + 1);
                }
            });
        }
    
        // **New Validation for Quizzes**
        if (!data.quizData || data.quizData.length === 0) {
            fieldErrors['quizData'] = 'At least one quiz is required';
        } else {
            data.quizData.forEach((quiz: any, index: number) => {
                if (!quiz.quizName) {
                    fieldErrors[`quizName-${index}`] = 'Quiz name is required for quiz ' + (index + 1);
                }
                if (!quiz.question) {
                    fieldErrors[`question-${index}`] = 'Question is required for quiz ' + (index + 1);
                }
                if (!quiz.userInstructions) {
                    fieldErrors[`userInstructions-${index}`] = 'User instruction is required for quiz ' + (index + 1);
                }
                if (quiz.type === 'multiple-choice' && (!quiz.options || quiz.options.length === 0)) {
                    fieldErrors[`options-${index}`] = 'At least one option is required for multiple-choice quiz ' + (index + 1);
                }
            });
        }
    
        setErrors(fieldErrors);
    
        // If there are no errors, return true, otherwise false
        return Object.keys(fieldErrors).length === 0;
    };
    

    const handlePreview = () => {
        if (validateFields()) {
            console.log('Validation passed');
            if (isEditMode) {
                dispatch(updateLessonThunk({ id: params.id, data: data })).then((response: any) => {
                    console.log('Update response:', response);
                    navigate('/content/lessons/viewlesson/' + response.payload.data.id);
                });
            } else {
                // Instead of adding the lesson and navigating directly, show the preview
                setShowPreview(true);
            }
        } else {
            console.log('Validation failed', errors);
        }
    };
    
    

    // Function to handle saving as draft
const saveAsDraft = () => {
    const draftData = {
        ...data,
        status: 'DRAFT', // Set the status to DRAFT
    };

    if (isEditMode) {
        dispatch(updateLessonThunk({ id: params.id, data: draftData }))
            .then((response: any) => {
                console.log('Draft update response:', response);
                navigate('/content/lessons');
            })
            .catch((error: any) => {
                console.error('Error updating draft:', error);
            });
    } else {
        dispatch(addLessonThunk(draftData))
            .then((response: any) => {
                console.log('Draft add response:', response);
                navigate('/content/lessons');
            })
            .catch((error: any) => {
                console.error('Error adding draft:', error);
            });
    }
};

const handleBackClick = () => {
    if (showPreview) {
        setShowPreview(false); // Go back to the edit form
    } else {
        navigate(-1); // Go back to the previous page
    }
};

    if (showPreview) {
        return (
            <PreviewLessons
                data={data}
                isEditMode={isEditMode}
                onBack={handleBackClick} // Function to go back to the Create form
            />
        );
    }

    return (
        <>
            <BackButton onClick={handleBackClick} />
            <div className={classNames(styles.container, className)}>
                <Sidebar />
                <div className={styles.content}>
                    <header className={styles.header}>
                        {isEditMode ? (
                            <Typography variant="h5">Edit lesson</Typography>
                        ) : (
                            <Typography variant="h5">Create a new lesson</Typography>
                        )}
                        <div className={styles.leftButtonContainer}>
                            <EditButton
                                buttonText="Cancel"
                                onButtonClick={() => navigate('/content/lessons')}
                            />
                        </div>
                        <div className={styles.rightButtonContainer}>
                            <EditButton
                                buttonText="Save as draft"
                                onButtonClick={saveAsDraft}
                            />
                            <AppButton buttonText="Preview" onButtonClick={handlePreview} />
                        </div>
                    </header>
                    <div className={styles.mainContent}>
                        <LessonInformation
                            data={data}
                            setData={setData}
                            isEditMode={isEditMode}
                            theme={theme}
                            setTheme={setTheme}
                            selectedTheme={selectedTheme}
                            setSelectedTheme={setSelectedTheme}
                            errors={errors}
                            setErrors={setErrors}
                        />
                        <div className={styles.rightContent}>
                            <InternalNotes
                                notes={notes}
                                setNotes={setNotes}
                                data={data}
                                setData={setData}
                                errors={errors}
                            />
                            <DashboardCardDetails
                                dashboardCardDetails={dashboardCardDetails}
                                setDashboardCardDetails={setDashboardCardDetails}
                                data={data}
                                setData={setData}
                                errors={errors}
                                setErrors={setErrors}
                            />

                            <LessonContent
                                screenData={screenData}
                                setScreenData={setScreenData}
                                quizData={quizData}
                                setQuizData={setQuizData}
                                data={data}
                                setData={setData}
                                errors={errors}
                                setErrors={setErrors}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
