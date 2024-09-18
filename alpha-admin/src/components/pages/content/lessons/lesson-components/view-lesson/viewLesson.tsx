import classNames from 'classnames';
import { Typography, Button } from '@mui/material';
import styles from './viewLesson.module.scss';
import { AppButton } from '../../../../../app-button/app-button';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Sidebar from '../../../content-components/sidebar/Sidebar';
import { EditButton } from '../../../content-components/edit-button/edit-button';
import LessonInformation from '../lesson-information/lessonInformation';
import TagsComponent from '../tags/tags';
import { PublishButton } from '../../../content-components/publish-button/publishButton';
import { useAppDispatch } from '../../../../../../app/hooks';
import { useEffect, useState } from 'react';
import { fetchLessonByIdThunk, updateLessonThunk } from '../lessonsSlice';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { BackButton } from '../../../../../back-button/backButton';


export interface ContentProps {
    className?: string;
    showTags?: boolean;
    showAlternateButtons?: boolean;
}
export interface Category {}

export const ViewLessons = ({
    className,
    showTags = true,
    showAlternateButtons = false,
}: ContentProps) => {
    // const params = useParams();
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const [lessonData, setLessonData] = useState({
        name: '',
        lessonCode: '',
        duration: '',
        points: '',
        description: '',
        internalNotes: '',
        isPublished: false,
        theme: { name: '' },
        category: { name: '' },
        lessonTags: [
            {
                Ethnicity: [],
            },
            {
                Leisure_Preferences: [],
            },
            {
                Dietary_Restrictions: [],
            },
            {
                Physical_Limitation: [],
            },
            {
                Physical_Limitation_Follow_up: [],
            },
            {
                Unhealthy_Eating_Habits: [],
            },
            {
                Motivation_to_Change: [],
            },
            {
                Goals_Motivators: [],
            },
            {
                Young_Dependents: [],
            },
            {
                Adult_Dependents: [],
            },
        ],
    });
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const { isPublished } = location.state || {};

    const showAltButtons = state?.showAlternateButtons ?? showAlternateButtons;
    const shouldShowTags = state?.showTags ?? showTags;

    useEffect(() => {
        if (id) {
            dispatch(fetchLessonByIdThunk(id))
                .unwrap()
                .then((res: any) => {
                    const fetchedLesson = res.data; // Adjust based on your response structure
                    setLessonData({
                        name: fetchedLesson.name,
                        lessonCode: fetchedLesson.lessonCode,
                        duration: fetchedLesson.duration,
                        points: fetchedLesson.points,
                        description: fetchedLesson.description,
                        internalNotes: fetchedLesson.internalNotes,
                        theme: fetchedLesson.theme,
                        category: fetchedLesson.category,
                        lessonTags: fetchedLesson.lessonTags,
                        isPublished: fetchedLesson.isPublished,
                    });
                })
                .catch((error: any) => {
                    console.error('Error fetching lesson:', error);
                });
        }
    }, []);

    const handlePublish = () => {
        console.log('Publish');
        const newData = {
                isPublished: true,
        };
        dispatch(updateLessonThunk({ id: id, data: newData }))
            .then((response: any) => {
                navigate('/content/lessons');
            })
            .catch((error: any) => {
                console.log('Response ERROR ', error);
                alert('Error updating theme');
            });
    };
    const handleUnpublish = () => {
        console.log('Unpublish');
        const newData = {
                isPublished: false,
        };
        dispatch(updateLessonThunk({ id: id, data: newData }))
            .then((response: any) => {
                navigate('/content/lessons');
            })
            .catch((error: any) => {
                console.log('Response ERROR ', error);
                alert('Error updating theme');
            });
    };

    const handleBackClick = () => {
        navigate(-1); // This will navigate to the previous page
    };

    return (
        <>
          <BackButton onClick={handleBackClick}/>
        <div className={classNames(styles.container, className)}>
            <Sidebar />
            <div className={styles.content}>
                <header className={styles.header}>
                    <div className={styles.leftButtonContainer}>
                        <Typography variant="h5">View lessons</Typography>
                        {isPublished ? (
                            <PublishButton buttonText="Published" />
                        ) : (
                            <PublishButton buttonText="Unpublished" isUnpublished />
                        )}
                    </div>
                    <div className={styles.buttonContainer}>
                        {showAltButtons ? (
                            <>
                                <EditButton
                                    buttonText="Cancel"
                                    onButtonClick={() => navigate(`/content/lessons/editlesson/`)}
                                />
                                <AppButton
                                    buttonText="Add to selections"
                                    onButtonClick={() => navigate('/some-add-route')}
                                />
                            </>
                        ) : isPublished ? (
                            <>
                                <EditButton
                                    showLeftIcon
                                    buttonText="Edit"
                                    onButtonClick={() =>
                                        navigate(`/content/lessons/editlesson/${id}`)
                                    }
                                />
                                <EditButton
                                    buttonText="Unpublish & save as draft"
                                    onButtonClick={() => handleUnpublish()}
                                />
                                <AppButton
                                    buttonText="Save updates"
                                    onButtonClick={() => navigate('/content/lessons')}
                                />
                            </>
                        ) : (
                            <>
                                <EditButton
                                    showLeftIcon
                                    buttonText="Edit"
                                    onButtonClick={() =>
                                        navigate(`/content/lessons/editlesson/${id}`)
                                    }
                                />
                                <EditButton
                                    buttonText="Save updates"
                                    onButtonClick={() => navigate('/content/lessons')}
                                />
                                <AppButton
                                    buttonText="Publish"
                                    onButtonClick={() => handlePublish()}
                                />
                            </>
                        )}
                    </div>
                </header>
                <LessonInformation lessonData={lessonData} setLessonData={setLessonData} />

                {shouldShowTags && <TagsComponent categories={lessonData.lessonTags} />}
                {/* Conditionally render TagsComponent */}
            </div>
        </div>
        </>
    );
};
