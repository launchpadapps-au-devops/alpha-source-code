import classNames from 'classnames';
import {
    Box,
    Typography,
    Button,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Tabs,
    Tab,
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
    const params = useParams();
    // Extract search query from URL

    let [data, setData] = React.useState({
        lessonCode: Number,
        categoryId: 0,
        themeId: 0,
        status: 'ACTIVE',
        isPublished: false,
        duration: 10,
        points: 20,
        lessonTags: [
            {
                motivation: [],
            },
            {
                gender: [],
            },
            {
                cultural_background: [],
            },
            {
                living_situation: [],
            },
            {
                food_intoletance: [],
            },
            {
                lifeStyle: [],
            },
            {
                physical_limitation: [],
            },
        ],
        internalNotes: '',
        coverImage: '',
        name: '',
        description: '',
        screenData: [
            // {
            //     order: 1,
            //     media: 'https://sample.com/sample.jpg',
            //     type: 'image',
            //     subTitle: 'Sub Title',
            //     content: 'Content',
            // },
        ],
        quizData: [
            {
                quizName: '',
                userInstructions: '',
                question: '',
                type: 'single-choice', //'single-choice',
                options: [
                    // {
                    //     option: 'Option 1',
                    //     isCorrect: true,
                    //     id: 1,
                    // },
                ],
                answer: [
                    // {
                    //     option: 'Option 1',
                    //     isCorrect: true,
                    //     id: 1,
                    // },
                ],
            },
        ],
    });
    console.log('data', data);
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
        },
    ]);

    useEffect(() => {
        dispatch(fetchThemesThunk()).then((response: any) => {
            setTheme(response.payload.data);
        });
        dispatch(fetchCategoriesThunk())
            .then((response: any) => {
                setCategories(response.payload.data);
            })
            .catch((error: any) => {
                alert(error);
            });
    }, []);

    useEffect(() => {
        console.log('params', location.pathname);
        if (location.pathname.includes('editlesson')) {
            setIsEditMode(true);
            // Fetch lesson details
            dispatch(fetchLessonByIdThunk(params.id)).then((response: any) => {
                if (response.payload.data) {
                    setData(response.payload.data);
                }
            });
        }
    }, []);

    const handlePreview = () => {
        if (isEditMode) {
            dispatch(updateLessonThunk({ id: params.id, data: data })).then((response: any) => {
                console.log('Response', response);
                navigate('/content/lessons/viewlesson/' + response.payload.data.id);
            });
        }
        {
            dispatch(addLessonThunk(data)).then((response: any) => {
                console.log('Response', response);
                navigate('/content/lessons/viewlesson/' + response.payload.data.id);
            });
        }
    };

    return (
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
                        <EditButton
                            buttonText="Cancel"
                            onButtonClick={() => navigate('/content/lessons')}
                        />
                        {/* <EditButton
                            buttonText="Save as draft"
                            onButtonClick={() => navigate('/careteam/createcontent')}
                        /> */}
                        <AppButton buttonText="Preview" onButtonClick={() => handlePreview()} />
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
                    />
                    <div className={styles.rightContent}>
                        <InternalNotes
                            notes={notes}
                            setNotes={setNotes}
                            data={data}
                            setData={setData}
                        />
                        <DashboardCardDetails
                            dashboardCardDetails={dashboardCardDetails}
                            setDashboardCardDetails={setDashboardCardDetails}
                            data={data}
                            setData={setData}
                        />
                        <LessonContent
                            screenData={screenData}
                            setScreenData={setScreenData}
                            // isEditMode={isEditMode}
                            quizData={quizData}
                            setQuizData={setQuizData}
                            data={data}
                            setData={setData}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
