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
import { useBeforeUnload, useBlockBackButton, usePrompt } from './createNewLesson-components/unchanged-warning-hook';

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
    // const [dirty, setDirty] = useState(false); 
    const { setDirty, dirty } = useUnsavedChanges();  // Use context state


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
        // if (!data.coverImage) {
        //     fieldErrors.coverImage = 'Cover image is required';
        // }
    
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
    

    const formatData = (dataVal: any) => {
        console.log('DataVal:', dataVal);
        return {
            ...dataVal,
            lessonCode: Number(dataVal?.lessonCode),
            categoryId: Number(dataVal?.categoryId),
            duration: Number(dataVal?.duration),
            points: Number(dataVal?.points),
            lessonTags: dataVal?.lessonTags.map((tag: { Prop: any[] }) => ({
                Prop: tag.Prop.filter(Boolean), // Ensure non-empty tags
            })),
            screenData: dataVal.screenData.map((screen: { order: any }) => ({
                ...screen,
                order: Number(screen.order),
            })),
            freeTextQuiz: dataVal.freeTextQuiz.map(
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
            ),
            quizData: dataVal.quizData.map(
                (quiz: { id: any; min: any; max: any; options: any[]; answer: any[] }) => ({
                    ...quiz,
                    id: Number(quiz.id),
                    min: Number(quiz.min),
                    max: Number(quiz.max),
                    options: quiz.options?.map(
                        (option: { id: any; option: any; isCorrect: any }, index: number) => ({
                            id: option.id || index + 1,
                            option: option.option || '',
                            isCorrect: option.isCorrect || false,
                        })
                    ),
                    answer: Array.isArray(quiz.answer)
                        ? quiz.answer.map(
                              (ans: { id: any; option: any; isCorrect: any }, index: number) => ({
                                  id: ans.id || index + 1,
                                  option: ans.option || '',
                                  isCorrect: ans.isCorrect || false,
                              })
                          )
                        : [], // Default to an empty array if not an array
                })
            ),
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
                setShowPreview(true);
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
        if (validateFields()) {
        setData(updatedData);
        console.log('Data:', updatedData);
        const formattedData = formatData(updatedData);
        console.log('Formatted data:', formattedData);

        if (isEditMode) {
            dispatch(updateLessonThunk({ id: params.id, data: formattedData })).then(
                (response: any) => {
                    navigate('/content/lessons/viewlesson/' + response.payload.data.id);
                }
            );
        } else {
            setShowPreview(true); // Show preview before submission
        }
        } else {
            console.log('Validation failed', errors);
        }
    };

    const saveAsDraft = () => {
        const updatedData = updateQuizData(data);
        console.log('Data:', updatedData);
        setData(updatedData);

        if (isEditMode) {
            dispatch(updateLessonThunk({ id: params.id, data: updatedData }))
                .then((response: any) => {
                    navigate('/content/lessons');
                })
                .catch((error: any) => {
                    console.error('Error updating draft:', error);
                });
        } else {
            dispatch(addLessonThunk(updatedData))
                .then((response: any) => {
                    navigate('/content/lessons');
                    setDirty(false); // Reset dirty state after saving
                    setShowPrompt(false); 
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
        handleCancel={handleDiscardChanges}
        closeModal={handleCancelNavigation}
        descriptionText="You have unsaved changes. Do you want to save them before leaving?"
        />
      )}
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
                            <EditButton buttonText="Save as draft" onButtonClick={saveAsDraft} />
                            <AppButton buttonText="Preview" onButtonClick={handlePreview} />
                        </div>
                    </header>
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
