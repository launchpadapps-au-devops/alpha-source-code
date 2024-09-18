import classNames from 'classnames';
import {
    Typography,
} from '@mui/material';
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
        coverImage: 'https://sample.com/sample.jpg',
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

        if (data.coverImage) {
            fieldErrors.coverImage = 'Cover image is required';
        }

        setErrors(fieldErrors);

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
                dispatch(addLessonThunk(data)).then((response: any) => {
                    console.log('Add response:', response);
                    navigate('/preview-lesson' + response.payload.data.id);
                });
            }
        } else {
            console.log('Validation failed', errors);
        }
    };
    

    const handleBackClick = () => {
        navigate(-1);
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
                        <div className={styles.buttonContainer}>
                            <EditButton buttonText="Cancel" onButtonClick={() => navigate('/content/lessons')} />
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
                            setErrors={setErrors}                        />
                        <div className={styles.rightContent}>
                            <InternalNotes notes={notes} setNotes={setNotes} data={data} setData={setData} errors={errors} />
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
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
