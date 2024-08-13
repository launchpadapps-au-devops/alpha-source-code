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
import { fetchLessonByIdThunk } from '../lessonsSlice';

const categories = [
    {
        title: 'Food tags',
        tags: ['Gluten free', 'Gluten free', 'Gluten free'],
    },
    {
        title: 'Tag category',
        tags: ['Gluten free', 'Gluten free'],
    },
    {
        title: 'Tag category',
        tags: ['Gluten free', 'Gluten free'],
    },
    {
        title: 'Tag category',
        tags: ['Gluten free', 'Gluten free'],
    },
];

export interface ContentProps {
    className?: string;
    showTags?: boolean;
    showAlternateButtons?: boolean;
}

export const ViewLessons = ({
    className,
    showTags = true,
    showAlternateButtons = false,
}: ContentProps) => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const [lessonData, setLessonData] = useState({
        name: '',
        lessonCode: '',
        duration: '',
        points: '',
        description: '',
        internalNotes: '',
        theme: { name: '' },
        category: { name: '' },
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
                    });
                })
                .catch((error: any) => {
                    console.error('Error fetching lesson:', error);
                });
        }
    }, []);

    return (
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
                                    onButtonClick={() => navigate(`/content/editlesson/`)}
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
                                    onButtonClick={() => navigate(`/content/editlesson/${id}`)}
                                />
                                <EditButton
                                    buttonText="Unpublish & save as draft"
                                    onButtonClick={() => navigate('/careteam/createcontent')}
                                />
                                <AppButton
                                    buttonText="Save updates"
                                    onButtonClick={() => navigate('/careteam/createcontent')}
                                />
                            </>
                        ) : (
                            <>
                                <EditButton
                                    showLeftIcon
                                    buttonText="Edit"
                                    onButtonClick={() => navigate(`/content/editlesson/${id}`)}
                                />
                                <EditButton
                                    buttonText="Save updates"
                                    onButtonClick={() => navigate('/careteam/createcontent')}
                                />
                                <AppButton
                                    buttonText="Publish"
                                    onButtonClick={() => navigate('/careteam/createcontent')}
                                />
                            </>
                        )}
                    </div>
                </header>
                <LessonInformation lessonData={lessonData} setLessonData={setLessonData} />
                {shouldShowTags && <TagsComponent categories={categories} />}
                {/* Conditionally render TagsComponent */}
            </div>
        </div>
    );
};
