import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '../../../../../../app/hooks';
import classNames from 'classnames';
import { Typography } from '@mui/material';
import Sidebar from '../../../content-components/sidebar/Sidebar';
import { BackButton } from '../../../../../back-button/backButton';
import { PreviewLessons } from './createNewLesson-components/preview-lesson/previewLesson';
import { LessonInformation } from './createNewLesson-components/lessonInformation/lessonInformation';
import { InternalNotes } from './createNewLesson-components/InternalNotes/internalNotes';
import { DashboardCardDetails } from './createNewLesson-components/dashboardcarddetails/dashBoardCardDetails';
import { LessonContent } from './createNewLesson-components/lessonContent/lessonContent';
import styles from './createNewLesson.module.scss';
import { AppButton } from '../../../../../app-button/app-button';
import { EditButton } from '../../../content-components/edit-button/edit-button';
import { fetchThemesThunk } from '../../../themes/themes-components/themeSlice';
import { fetchCategoriesThunk } from '../../../categories/category-component/categorySlice';
import { addLessonThunk, fetchLessonByIdThunk, updateLessonThunk } from '../lessonsSlice';
import { UnsavedChangesModal } from '../../../content-components/unsaved-changes-alert/unsavedChanges';
import { useUnsavedChanges } from '../unchanged-warning-hook-context';
import {
    useBeforeUnload,
    useBlockBackButton,
    usePrompt,
} from './createNewLesson-components/unchanged-warning-hook';
import NotificationBanner from '../../../../notification-banner/notificationBanner';

interface LessonTag {
    Ethnicity?: string[]; // Optional property of type string array
    'Leisure Preferences'?: string[]; // Optional property with spaces, needs to be in quotes
    'Dietary Restrictions'?: string[];
    'Physical Limitation'?: string[];
    'Physical Limitation- Follow up'?: string[];
    'Unhealthy Eating Habits'?: string[];
    'Motivation to Change'?: string[];
    'Goals/Motivators'?: string[];
    'Young Dependents'?: string[];
    'Adult Dependents'?: string[];
}

interface ScreenData {
    type: string;
    media: string;
    order: number;
    content: string;
    subTitle: string;
}

interface FreeTextQuiz {
    id: number;
    type: string;
    answer: string;
    question: string;
    quizName: string;
    userInstructions: string;
}

interface QuizOption {
    id: number;
    option: string;
    isCorrect: boolean;
}

interface Quiz {
    id: number;
    min: number;
    max: number;
    type: string;
    answer: QuizOption[];
    options: QuizOption[];
    question: string;
    quizName: string;
    userInstructions: string;
}

interface LessonData {
    lessonCode: number | string;
    categoryId: number | string;
    status: string;
    isPublished: boolean;
    duration: number | string;
    points: number | string;
    lessonTags: LessonTag[];
    internalNotes: string;
    coverImage: string;
    name: string;
    description: string;
    screenData: ScreenData[];
    freeTextQuiz: FreeTextQuiz[];
    quizData: any[];
    message: string;
    meta: object;
    statusCode: number;
}

export const CreateNewLesson = ({ className }: { className?: string }) => {
    const navigate = useNavigate();
    const [notes, setNotes] = useState<string>('');
    const [theme, setTheme] = useState<any[]>([]);
    const [selectedTheme, setSelectedTheme] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const dispatch = useAppDispatch();
    const location = useLocation();
    const [isEditMode, setIsEditMode] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const params = useParams();
    const [errors, setErrors] = useState<any>({});
    const [showPrompt, setShowPrompt] = useState(false);
    const { setDirty, dirty } = useUnsavedChanges(); // Use context state
    const [notification, setNotification] = useState({
        isVisible: false,
        message: '',
        type: 'success' as 'success' | 'error' | 'delete', // Add the 'delete' type
    });

    const [dashboardCardDetails, setDashboardCardDetails] = useState<{
        coverImage: string;
        lessonName: string;
        lessonDescription: string;
    }>({
        coverImage: '',
        lessonName: '',
        lessonDescription: '',
    });

    usePrompt('You have unsaved changes. Do you want to leave without saving?', dirty);

    useBeforeUnload(dirty); // Hook to manage page refresh/close
    useBlockBackButton(dirty); // Hook to block back button

    // Updated type for data state
    const [data, setData] = useState<LessonData>({
        lessonCode: '',
        categoryId: '',
        status: 'ACTIVE',
        isPublished: false,
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
        screenData: [
            {
                type: '',
                media: '',
                order: 1,
                content: '',
                subTitle: '',
            },
        ],
        freeTextQuiz: [
            // {
            //     id: 1,
            //     type: 'free-text',
            //     answer: '',
            //     question:
            //         'Think of a recent event where you felt disappointed in yourself - perhaps a goal you didn’t meet or a time you didn’t uphold a commitment to yourself.',
            //     quizName: 'Identify the Scenario',
            //     userInstructions: 'Please write down a scenario that comes to your mind below.',
            // },
            // {
            //     id: 2,
            //     type: 'free-text',
            //     answer: '',
            //     question:
            //         'Think of another event where you felt disappointed in yourself - perhaps a goal you didn’t meet or a time you didn’t uphold a commitment to yourself.',
            //     quizName: 'Identify the Scenario 2',
            //     userInstructions: 'Please write down a scenario that comes to your mind below.',
            // },
        ],
        quizData: [
            {
                id: 1,
                type: 'single-choice',
                answer: '',
                question: '',
                quizName: '',
                userInstructions: '',
            },
            // {
            //     id: 1,
            //     min: 2,
            //     max: 2,
            //     type: 'single-choice',
            //     answer: [{ id: 1, option: '', isCorrect: false }],
            //     options: [{ id: 1, option: '', isCorrect: false }],
            //     question: '',
            //     quizName: '',
            //     userInstructions: '',
            // },
        ],
        message: 'User daily lesson fetched successfully',
        meta: {},
        statusCode: 200,
    });

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
    }, [dispatch]);

    useEffect(() => {
        if (location.pathname.includes('editlesson')) {
            setIsEditMode(true);
            dispatch(fetchLessonByIdThunk(params.id)).then((response: any) => {
                if (response.payload.data) {
                    // Ensure freeTextQuiz is set correctly in the state
                    setData((prevState) => ({
                        ...response.payload.data,
                        freeTextQuiz: response.payload.data.freeTextQuiz || [], // Ensure it's an array
                    }));
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

        // Validation for Lesson Tags
        data.lessonTags.forEach((tag: any) => {
            const tagKey = Object.keys(tag)[0]; // Extract the tag key
            if (!tag[tagKey] || tag[tagKey].length === 0) {
                fieldErrors[`tag-${tagKey}`] = `${tagKey} is required`;
            }
        });

        // Validation for Lesson Content Screens
        if (!data.screenData || data.screenData.length === 0) {
            fieldErrors['screenData'] = 'At least one screen is required';
        } else {
            data.screenData.forEach((screen: any, index: number) => {
                if (!screen.subtitle) {
                    fieldErrors[`subtitle-${index}`] =
                        'Subtitle is required for screen ' + (index + 1);
                }
                if (!screen.content) {
                    fieldErrors[`content-${index}`] =
                        'Content is required for screen ' + (index + 1);
                }
                if (!screen.media) {
                    fieldErrors[`media-${index}`] = 'Media is required for screen ' + (index + 1);
                }
            });
        }

        // **New Validation for Quizzes**
        // if (!data.quizData || data.quizData.length === 0) {
        //     fieldErrors['quizData'] = 'At least one quiz is required';
        // } else {
        //     data.quizData.forEach((quiz: any, index: number) => {
        //         if (!quiz.quizName) {
        //             fieldErrors[`quizName-${index}`] =
        //                 'Quiz name is required for quiz ' + (index + 1);
        //         }
        //         if (!quiz.question) {
        //             fieldErrors[`question-${index}`] =
        //                 'Question is required for quiz ' + (index + 1);
        //         }
        //         if (!quiz.userInstructions) {
        //             fieldErrors[`userInstructions-${index}`] =
        //                 'User instruction is required for quiz ' + (index + 1);
        //         }
        //         if (
        //             quiz.type === 'multiple-choice' &&
        //             (!quiz.options || quiz.options.length === 0)
        //         ) {
        //             fieldErrors[`options-${index}`] =
        //                 'At least one option is required for multiple-choice quiz ' + (index + 1);
        //         } else if (quiz.type === 'multiple-choice') {
        //             // Check that at least one option is marked as correct
        //             const correctOptions = quiz.options.filter((option: any) => option.isCorrect);
        //             if (correctOptions.length === 0) {
        //                 fieldErrors[`correctAnswer-${index}`] = 'At least one correct answer is required for quiz ' + (index + 1);
        //             }
        //         }
        //     });
        // }

        data.quizData.forEach((quiz: any, index: number) => {
            if (!quiz.quizName) {
                fieldErrors[`quizName-${index}`] = 'Quiz name is required for quiz ' + (index + 1);
            }
            if (!quiz.question) {
                fieldErrors[`question-${index}`] = 'Question is required for quiz ' + (index + 1);
            }
            if (!quiz.userInstructions) {
                fieldErrors[`userInstructions-${index}`] =
                    'User instruction is required for quiz ' + (index + 1);
            }

            // Validation for multiple-choice quiz
            if (quiz.type === 'multiple-choice') {
                if (!quiz.options || quiz.options.length === 0) {
                    fieldErrors[`options-${index}`] =
                        'At least one option is required for quiz ' + (index + 1);
                } else {
                    quiz.options.forEach((option: any, optionIndex: number) => {
                        if (!option.option) {
                            fieldErrors[`option-${index}-${optionIndex}`] = `Option ${
                                optionIndex + 1
                            } is required for quiz ${index + 1}`;
                        }
                    });

                    // Check if at least one option is correct
                    const correctOptions = quiz.options.filter((option: any) => option.isCorrect);
                    if (correctOptions.length === 0) {
                        fieldErrors[
                            `correctAnswer-${index}`
                        ] = `At least one correct answer is required for quiz ${index + 1}`;
                    }
                }
            }
        });

        setErrors(fieldErrors);

        // If there are no errors, return true, otherwise false
        return Object.keys(fieldErrors).length === 0;
    };

    const formatData = (dataVal: any) => {
        console.log('DataVal:', dataVal);
        return {
            ...dataVal,
            lessonCode: Number(dataVal?.lessonCode),
            categoryId: Number(dataVal?.categoryId),
            duration: Number(dataVal?.duration),
            points: Number(dataVal?.points),

            // Safely handle lessonTags mapping
            lessonTags: Array.isArray(dataVal?.lessonTags)
                ? dataVal.lessonTags.map((tag: { Prop: any[] }) => ({
                      Prop: Array.isArray(tag?.Prop) ? tag.Prop.filter(Boolean) : [], // Ensure non-empty and valid array
                  }))
                : [], // Default to an empty array if undefined or not an array

            // Safely handle screenData mapping
            screenData: Array.isArray(dataVal?.screenData)
                ? dataVal.screenData.map((screen: { order: any }) => ({
                      ...screen,
                      order: Number(screen.order),
                  }))
                : [], // Default to an empty array if undefined or not an array

            // Safely handle freeTextQuiz mapping
            freeTextQuiz: Array.isArray(dataVal?.freeTextQuiz)
                ? dataVal.freeTextQuiz.map(
                      (quiz: {
                          id: any;
                          type: any;
                          answer: any;
                          question: any;
                          quizName: any;
                          userInstructions: any;
                      }) => ({
                          id: quiz.id,
                          type: quiz.type,
                          answer: quiz.answer || '',
                          question: quiz.question,
                          quizName: quiz.quizName,
                          userInstructions: quiz.userInstructions,
                      })
                  )
                : [], // Default to an empty array if undefined or not an array

            // Safely handle quizData mapping
            quizData: Array.isArray(dataVal?.quizData)
                ? dataVal.quizData.map(
                      (quiz: { id: any; min: any; max: any; options: any[]; answer: any[] }) => ({
                          ...quiz,
                          id: Number(quiz.id),
                          min: Number(quiz.min),
                          max: Number(quiz.max),
                          options: Array.isArray(quiz.options)
                              ? quiz.options.map(
                                    (
                                        option: { id: any; option: any; isCorrect: any },
                                        index: number
                                    ) => ({
                                        id: option.id || index + 1,
                                        option: option.option || '',
                                        isCorrect: option.isCorrect || false,
                                    })
                                )
                              : [], // Default to empty array if undefined or not an array
                          answer: Array.isArray(quiz.answer)
                              ? quiz.answer.map(
                                    (
                                        ans: { id: any; option: any; isCorrect: any },
                                        index: number
                                    ) => ({
                                        id: ans.id || index + 1,
                                        option: ans.option || '',
                                        isCorrect: ans.isCorrect || false,
                                    })
                                )
                              : [], // Default to empty array if not an array
                      })
                  )
                : [], // Default to an empty array if undefined or not an array
        };
    };

    function updateQuizData(data: any) {
        const newQuizData: any[] = [];
        const newFreeTextQuiz: FreeTextQuiz[] = data.freeTextQuiz.slice(); // Clone existing freeTextQuiz

        data.quizData.forEach((quiz: FreeTextQuiz | Quiz) => {
            if (quiz.type === 'single-choice') {
                // Assuming you need to convert the answer format
                newFreeTextQuiz.push({
                    ...quiz,
                } as FreeTextQuiz); // Cast as FreeTextQuiz
            } else {
                // Instead of adding the lesson and navigating directly, show the preview
                // setShowPreview(true);
                newQuizData.push(quiz);
            }
        });

        return {
            ...data,
            quizData: newQuizData,
            freeTextQuiz: newFreeTextQuiz,
        };
    }

    const handlePreview = () => {
        const updatedData = updateQuizData(data);
        // Run validation
        const isValid = validateFields();
    
        if (isValid) {
            const formattedData = formatData(updatedData);
            setData(formattedData); // Update the state with the formatted data
            setShowPreview(true);  
            console.log('Formatted data:', formattedData);
    
            if (isEditMode) {
                // In edit mode, we navigate to the view page after updating
                dispatch(updateLessonThunk({ id: params.id, data: formattedData }))
                    .then((response: any) => {
                        if (response.payload.statusCode === 200 || response.payload.statusCode === 201) {
                            // Show success notification
                            setNotification({
                                isVisible: true,
                                message: 'Lesson updated successfully!',
                                type: 'success',
                            });
    
                            // Hide notification after 3 seconds and navigate
                            setTimeout(() => {
                                setNotification((prev) => ({ ...prev, isVisible: false }));
                                navigate(`/content/lessons/viewlesson/${response.payload.data.id}`);
                            }, 1000);
                        }
                    })
                    .catch((error: any) => {
                        console.error('Error updating lesson:', error);
                        // Show error notification
                        setNotification({
                            isVisible: true,
                            message: 'Failed to update the lesson. Please try again.',
                            type: 'error',
                        });
    
                        // Hide notification after 3 seconds
                        setTimeout(() => {
                            setNotification((prev) => ({ ...prev, isVisible: false }));
                        }, 3000);
                    });
            } else {
                // Show preview when not in edit mode
                setShowPreview(true);
            }
        } else {
            // Prevent preview and show validation errors
            console.log('Validation failed', errors);
            // Show validation error notification
            setNotification({
                isVisible: true,
                message: 'Validation failed. Please fix the errors and try again.',
                type: 'error',
            });
    
            // Hide notification after 3 seconds
            setTimeout(() => {
                setNotification((prev) => ({ ...prev, isVisible: false }));
            }, 3000);
        }
    };
    

    const saveAsDraft = () => {
        // Update the status to DRAFT
        const updatedData = updateQuizData(data);
        const Data = {
            ...updatedData,
            status: 'DRAFT', // Set status to DRAFT for saving as draft
        };
    
        console.log('Formatted data:', Data);
    
        if (isEditMode) {
            // If in edit mode, update the existing lesson
            dispatch(updateLessonThunk({ id: params.id, data: Data }))
                .then((response: any) => {
                    if (response.payload.statusCode === 200 || response.payload.statusCode === 201) {
                        // Show success notification
                        setNotification({
                            isVisible: true,
                            message: 'Lesson saved as draft successfully!',
                            type: 'success',
                        });
    
                        // Hide notification after 3 seconds and navigate to lessons page
                        setTimeout(() => {
                            setNotification((prev) => ({ ...prev, isVisible: false }));
                            navigate('/content/lessons'); // Navigate to the lessons page
                        }, 1000);
                    }
                })
                .catch((error: any) => {
                    console.error('Error updating draft:', error);
                    // Show error notification
                    setNotification({
                        isVisible: true,
                        message: 'Failed to save draft. Please try again.',
                        type: 'error',
                    });
    
                    // Hide notification after 3 seconds
                    setTimeout(() => {
                        setNotification((prev) => ({ ...prev, isVisible: false }));
                    }, 3000);
                });
        } else {
            // If in create mode, add a new lesson as draft
            dispatch(addLessonThunk(Data))
                .then((response: any) => {
                    if (response.payload.statusCode === 200 || response.payload.statusCode === 201) {
                        // Show success notification
                        setNotification({
                            isVisible: true,
                            message: 'Lesson saved as draft successfully!',
                            type: 'success',
                        });
    
                        // Hide notification after 3 seconds and navigate to lessons page
                        setTimeout(() => {
                            setNotification((prev) => ({ ...prev, isVisible: false }));
                            navigate('/content/lessons');
                            setDirty(false); // Reset the dirty state after saving
                        }, 1000);
                    }
                })
                .catch((error: any) => {
                    console.error('Error adding draft:', error);
                    // Show error notification
                    setNotification({
                        isVisible: true,
                        message: 'Failed to save draft. Please try again.',
                        type: 'error',
                    });
    
                    // Hide notification after 3 seconds
                    setTimeout(() => {
                        setNotification((prev) => ({ ...prev, isVisible: false }));
                    }, 3000);
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
                data={data} // Pass correctly formatted data
                isEditMode={isEditMode}
                onBack={handleBackClick} // Function to go back to the Create form
            />
        );
    }

    const handleInputChange = () => {
        setDirty(true); // Mark the form as having unsaved changes when an input changes
    };

    const handleDiscardChanges = () => {
        setDirty(false); // Reset dirty state
        // Navigate away or allow navigation
        navigate(-1); // Navigate to the previous page
    };

    const handleCancelNavigation = () => {
        setShowPrompt(false); // Close the prompt
        // Keep the user on the current page
    };

    const handleNavigation = () => {
        // This function will be triggered when user tries to navigate away
        if (dirty) {
            setShowPrompt(true); // Show the prompt asking the user what to do
        } else {
            // Allow navigation if no unsaved changes
            navigate(-1);
        }
    };

    return (
        <>
            <BackButton onClick={handleNavigation} />
            <div className={classNames(styles.container, className)}>
                <Sidebar
                    setDirty={setDirty}
                    dirty={dirty}
                    saveAsDraft={saveAsDraft}
                    discardChanges={handleDiscardChanges}
                    cancelNavigation={handleCancelNavigation}
                />
                {showPrompt && (
                    <UnsavedChangesModal
                        open={showPrompt}
                        handleSaveAsDraft={saveAsDraft}
                        handleDontSave={handleDiscardChanges}
                        closeModal={handleCancelNavigation}
                        descriptionText="You have unsaved changes. Do you want to save them before leaving?"
                    />
                )}

                <NotificationBanner
                    isVisible={notification.isVisible}
                    message={notification.message}
                    onClose={() => setNotification((prev) => ({ ...prev, isVisible: false }))}
                    type={notification.type}
                />
                <div className={styles.content}>
                    <div className={styles.combinedHeader}>
                        <header className={styles.header}>
                            {isEditMode ? (
                                <Typography variant="h5">Edit lesson</Typography>
                            ) : (
                                <Typography variant="h5">Create a new lesson</Typography>
                            )}
                            {/* <div className={styles.leftButtonContainer}> */}
                            <EditButton
                                buttonText="Cancel"
                                onButtonClick={() => navigate('/content/lessons')}
                            />
                        </header>
                        {/* </div> */}
                        <div className={styles.rightButtonContainer}>
                            <EditButton buttonText="Save as draft" onButtonClick={saveAsDraft} />
                            <AppButton buttonText="Preview" onButtonClick={handlePreview} />
                        </div>
                    </div>
                    <div className={styles.mainContent}>
                        <LessonInformation
                            setDirty={setDirty}
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
                                setDirty={setDirty}
                                notes={notes}
                                setNotes={setNotes}
                                data={data}
                                setData={setData}
                                errors={errors}
                            />
                            <DashboardCardDetails
                                setDirty={setDirty}
                                dashboardCardDetails={dashboardCardDetails}
                                setDashboardCardDetails={setDashboardCardDetails}
                                data={data}
                                setData={setData}
                                errors={errors}
                                setErrors={setErrors}
                            />

                            <LessonContent
                                setDirty={setDirty}
                                screenData={data.screenData}
                                setScreenData={(newScreenData) =>
                                    setData((prev) => ({ ...prev, screenData: newScreenData }))
                                }
                                quizData={data.quizData}
                                setQuizData={(newQuizData) =>
                                    setData((prev) => ({ ...prev, quizData: newQuizData }))
                                }
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
