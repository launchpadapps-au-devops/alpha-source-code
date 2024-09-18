import classNames from 'classnames';
import { Typography, Button } from '@mui/material';
import styles from './previewLesson.module.scss';
import { AppButton } from '../../../../../../../app-button/app-button';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../../../content-components/sidebar/Sidebar';
import { EditButton } from '../../../../../content-components/edit-button/edit-button';
import { PublishButton } from '../../../../../content-components/publish-button/publishButton';
import { useAppDispatch } from '../../../../../../../../app/hooks';
import { addLessonThunk } from '../../../lessonsSlice';
import { BackButton } from '../../../../../../../back-button/backButton';

interface TagProps {
    label: string;
}

const Tag: React.FC<TagProps> = ({ label }) => {
    return <span className="tag">{label}</span>;
};

export const PreviewLessons = ({
    data,
    isEditMode,
    onBack,
}: {
    data: any;
    isEditMode: boolean;
    onBack: () => void;
}) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handlePublishClick = () => {
        dispatch(addLessonThunk(data)).then((response: any) => {
            console.log('Response', response);
            navigate('/content/lessons/viewlesson/' + response.payload.data.id);
        });
    };

    const handleBackClick = () => {
        onBack(); // Use the onBack function passed from CreateNewLesson to go back to the form
    };

    return (
        <>
            <BackButton onClick={handleBackClick} />
            <div className={classNames(styles.container)}>
                <Sidebar />
                <div className={styles.content}>
                    <header className={styles.header}>
                        <div className={styles.leftButtonContainer}>
                            <Typography variant="h5">View Lesson</Typography>
                            <PublishButton buttonText="Unpublished" isUnpublished />
                        </div>
                        <div className={styles.buttonContainer}>
                            <EditButton
                                showLeftIcon
                                buttonText="Edit"
                                // onButtonClick={() => navigate(`/content/lessons/editlesson`)}
                            />
                            <EditButton buttonText="Save as draft" />
                            <AppButton buttonText="Publish" onButtonClick={() => handlePublishClick()} />
                        </div>
                    </header>

                    {/* Lesson Information */}
                    <div className="lesson-information">
                        <div className="lesson-header">
                            <h2>Lesson Information</h2>
                        </div>
                        <div className="lesson-details">
                            <div className="lesson-item full-width">
                                <label>Lesson Name</label>
                                <div className="lesson-value">{data.name}</div>
                            </div>
                            <div className="lesson-grid">
                                <div className="lesson-item">
                                    <label>Lesson Code</label>
                                    <div className="lesson-value">{data.lessonCode}</div>
                                </div>
                                <div className="lesson-item">
                                    <label>Lesson Duration</label>
                                    <div className="lesson-value">{data.duration} mins</div>
                                </div>
                                <div className="lesson-item">
                                    <label>Lesson Category</label>
                                    <div className="lesson-value">{data.categoryId}</div>
                                </div>
                                <div className="lesson-item">
                                    <label>Points Allocation</label>
                                    <div className="lesson-value">{data.points}</div>
                                </div>
                            </div>
                            <div className="lesson-item full-width">
                                <label>Internal Notes</label>
                                <div className="lesson-value">{data.internalNotes}</div>
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="tags-component">
                        {data.lessonTags.map(
                            (category: { [s: string]: unknown } | ArrayLike<unknown>, index: number) => (
                                <div key={index} className="tag-category">
                                    {Object.entries(category).map(([title, tags], idx) => (
                                        <div key={idx}>
                                            <div className="category-title">{title}</div>
                                            <div className="tags">
                                                {(tags as string[] || []).map(
                                                    (tag: string, tagIdx: number) => (
                                                        <Tag key={tagIdx} label={tag} />
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        )}
                    </div>

                    {/* Cover Image */}
                    <div className="cover-image-section">
                        <h3>Cover Image</h3>
                        {data.coverImage && (
                            <img src={data.coverImage} alt="Cover" style={{ maxWidth: '100%' }} />
                        )}
                    </div>

                    {/* Screens */}
                    <div className="lesson-screens">
                        <h3>Screens</h3>
                        {data.screenData.map((screen: any, index: number) => (
                            <div key={index} className="screen-item">
                                <h4>Screen {index + 1}</h4>
                                {screen.media && (
                                    <img src={screen.media} alt={`Screen ${index + 1}`} style={{ maxWidth: '100%' }} />
                                )}
                                <div className="subtitle">Subtitle: {screen.subtitle}</div>
                                <div className="content">Content: {screen.content}</div>
                            </div>
                        ))}
                    </div>

                    {/* Quizzes */}
                    <div className="lesson-quizzes">
                        <h3>Quizzes</h3>
                        {data.quizData.map((quiz: any, index: number) => (
                            <div key={index} className="quiz-item">
                                <h4>Quiz {index + 1}</h4>
                                <div className="quiz-name">Quiz Name: {quiz.quizName}</div>
                                <div className="quiz-question">Question: {quiz.question}</div>
                                <div className="quiz-instructions">Instructions: {quiz.userInstructions}</div>
                                {quiz.type === 'multiple-choice' && (
                                    <div className="quiz-options">
                                        <h5>Options:</h5>
                                        <ul>
                                            {quiz.options.map((option: string, optIndex: number) => (
                                                <li key={optIndex}>{option}</li>
                                            ))}
                                        </ul>
                                        <h5>Correct Answers:</h5>
                                        <ul>
                                            {quiz.answer.map((answer: string, ansIndex: number) => (
                                                <li key={ansIndex}>{answer}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};
