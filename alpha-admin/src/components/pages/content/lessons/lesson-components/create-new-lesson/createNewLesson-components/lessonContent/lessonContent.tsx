import React, { useEffect, useRef, useState } from 'react';
import './lessonContent.scss';
import { UploadButton } from '../../../../../content-components/upload-button/uploadButton';
import { EditButton } from '../../../../../content-components/edit-button/edit-button';
import { Vector } from '../../../../../../../icon/glyps/vector';
import { Checkbox, Menu, MenuItem } from '@mui/material';
import { DeleteButton } from '../../../../../content-components/delete-button/delete-button';
import { useAppDispatch } from '../../../../../../../../app/hooks';
import { uploadFile } from '../../../../../../../fileUpload/fileUploadSlice';

export interface LessonContentProps {
    screenData: any[];
    setScreenData: (screenData: any) => void;
    quizData: any[];
    setQuizData: (quizData: any[]) => void;
    data: any;
    setData: any;
    isEditable?: boolean;
}

export const LessonContent = ({
    screenData,
    setScreenData,
    quizData,
    setQuizData,
    data,
    setData,
    isEditable,
}: LessonContentProps) => {
    const [screens, setScreens] = useState([{ subtitle: '', content: '' }]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuWidth, setMenuWidth] = useState<number>(0);
    const [activeQuizIndex, setActiveQuizIndex] = useState<number | null>(null);
    const [quizType, setQuizType] = useState<'multiple-choice' | 'free-text' | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [isFileUploaded, setIsFileUploaded] = useState(false); // State to track file upload
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error messages

    const dispatch = useAppDispatch();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = event.target.files?.[0];
        if (file) {
            const fileType = file.type;
            const fileSize = file.size;
            const isImage = fileType === 'image/jpeg' || fileType === 'image/png';
            const isVideo = fileType === 'video/mp4';

            // Validate file type and size
            if (isImage && fileSize <= 2 * 1024 * 1024) {
                // Image less than or equal to 2MB
                dispatch(uploadFile(file)).then((response: any) => {
                    const updatedScreenData = [...data.screenData];
                    updatedScreenData[index].media = response.payload.data.data.url;
                    setData({ ...data, screenData: updatedScreenData });
                    setIsFileUploaded(true);
                    setErrorMessage(null); // Clear any error message
                });
            } else if (isVideo && fileSize <= 100 * 1024 * 1024) {
                // Video less than or equal to 100MB
                dispatch(uploadFile(file)).then((response: any) => {
                    const updatedScreenData = [...data.screenData];
                    updatedScreenData[index].media = response.payload.data.data.url;
                    setData({ ...data, screenData: updatedScreenData });
                    setIsFileUploaded(true);
                    setErrorMessage(null); // Clear any error message
                });
            } else {
                // Invalid file type or size
                if (!isImage && !isVideo) {
                    setErrorMessage('Only JPG, PNG images or MP4 videos are allowed.');
                } else if (isImage && fileSize > 2 * 1024 * 1024) {
                    setErrorMessage('Image size should be less than or equal to 2MB.');
                } else if (isVideo && fileSize > 100 * 1024 * 1024) {
                    setErrorMessage('Video size should be less than or equal to 100MB.');
                }
            }
        }
    };

    const handleAddScreen = () => {
        const newScreen = {
            id: data.screenData.length + 1,
            subtitle: '',
            content: '',
            media: '',
            type: 'image',
        };
        const updatedScreenData = [...data.screenData, newScreen];
        setScreens(updatedScreenData);
        setData({ ...data, screenData: updatedScreenData });
    };

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if (buttonRef.current) {
            setMenuWidth(buttonRef.current.offsetWidth);
        }
    }, [buttonRef.current]);

    const handleQuizTypeChange = (type: 'multiple-choice' | 'free-text') => {
        setQuizType(type);
        setActiveQuizIndex(null);
        handleClose();
    };

    const handleAddQuiz = () => {
        const newQuiz = {
            quizName: '',
            userInstructions: '',
            question: '',
            type: quizType,
            options: quizType === 'multiple-choice' ? [] : undefined,
            answer: quizType === 'multiple-choice' ? [] : undefined,
        };
        const updatedQuizData = [...data.quizData, newQuiz];
        setData({ ...data, quizData: updatedQuizData });
        setQuizType(null);
    };

    const handleQuizChange = (index: number, key: string, value: any) => {
        const updatedQuizData = [...data.quizData];
        updatedQuizData[index][key] = value;
        setData({ ...data, quizData: updatedQuizData });
    };

    const handleRemoveQuiz = (index: number) => {
        const updatedQuizData = data.quizData.filter((_: any, i: any) => i !== index);
        setData({ ...data, quizData: updatedQuizData });
    };

    useEffect(() => {
        setScreenData(screens);
    }, [screens]);

    return (
        <div className="lesson-content">
            <h3>
                Lesson content <Vector />
            </h3>
            {data.screenData.map((screen: any, index: any) => (
                <div key={index} className="screen">
                    <h3>Screen {index + 1}</h3>
                    <div className="cover-image-section">
                        <label htmlFor="cover-image" className="cover-image-label">
                            Image or Video <span style={{ color: 'red' }}>*</span>{' '}
                            {/* Required indicator */}
                        </label>
                        <div className="cover-image-hint">
                            Image: JPG, PNG, max 2MB; Video: MP4, max 100MB
                        </div>
                        <UploadButton
                            showLeftIcon
                            buttonText="Upload media"
                            onButtonClick={() => {}}
                            data={data}
                            setData={setData}
                            handleFileChange={(e) => handleFileChange(e, index)}
                        />
                        {errorMessage && (
                            <div
                                className="error-message"
                                style={{ color: 'red', marginTop: '5px' }}
                            >
                                {errorMessage}
                            </div>
                        )}
                        {!isFileUploaded && (
                            <div
                                className="error-message"
                                style={{ color: 'red', marginTop: '5px' }}
                            >
                                Please upload a valid file.
                            </div>
                        )}
                    </div>
                    <div className="subtitle input-field">
                        <label>Subtitle</label>
                        <input
                            type="text"
                            placeholder="Enter lesson subtitle"
                            value={data.screenData[index]?.subtitle || ''}
                            onChange={(e) => {
                                const updatedScreenData = [...data.screenData];
                                updatedScreenData[index].subtitle = e.target.value;
                                setData({ ...data, screenData: updatedScreenData });
                            }}
                            required
                        />
                    </div>
                    <div className="content input-field">
                        <label>Content</label>
                        <input
                            type="text"
                            placeholder="Enter content"
                            value={data.screenData[index]?.content || ''}
                            onChange={(e) => {
                                const updatedScreenData = [...data.screenData];
                                updatedScreenData[index].content = e.target.value;
                                setData({ ...data, screenData: updatedScreenData });
                            }}
                            required
                        />
                    </div>
                </div>
            ))}
            <EditButton
                buttonText="Add another screen"
                onButtonClick={handleAddScreen}
                className="edit-button"
            />
            <h3>
                Quizzes <Vector />
            </h3>
            {data.quizData.map((quiz: any, index: number) => (
                <div key={index} className="quiz-content screen">
                    <div className="quiz-header">
                        <h3>
                            {quiz.type === 'multiple-choice'
                                ? 'Multiple choice quiz'
                                : 'Free text quiz'}
                        </h3>
                        <DeleteButton
                            showLeftIcon
                            buttonText="Remove quiz"
                            onButtonClick={() => handleRemoveQuiz(index)}
                        />
                    </div>
                    <div className="quiz-name input-field">
                        <label>Quiz name</label>
                        <input
                            type="text"
                            placeholder="Enter quiz name"
                            value={quiz.quizName || ''}
                            onChange={(e) => handleQuizChange(index, 'quizName', e.target.value)}
                            required
                        />
                    </div>
                    <div className="quiz-question input-field">
                        <label>Quiz question</label>
                        <input
                            type="text"
                            placeholder="Enter quiz question"
                            value={quiz.question || ''}
                            onChange={(e) => handleQuizChange(index, 'question', e.target.value)}
                            required
                        />
                    </div>
                    <div className="user-instruction input-field">
                        <label>User instruction</label>
                        <input
                            type="text"
                            placeholder="Enter User instruction"
                            value={quiz.userInstructions || ''}
                            onChange={(e) =>
                                handleQuizChange(index, 'userInstructions', e.target.value)
                            }
                            required
                        />
                    </div>
                    {quiz.type === 'multiple-choice' && (
                        <div className="multiple-choice input-field-1">
                            {quiz.options?.map((option: string, optionIndex: number) => (
                                <div key={optionIndex} className="input-with-checkbox">
                                    <div className="input-wrapper">
                                        <input
                                            type="text"
                                            placeholder={`Answer ${optionIndex + 1}`}
                                            value={option}
                                            onChange={(e) => {
                                                const updatedOptions = [...quiz.options];
                                                updatedOptions[optionIndex] = e.target.value;
                                                handleQuizChange(index, 'options', updatedOptions);
                                            }}
                                            required
                                        />
                                        <Checkbox
                                            checked={quiz.answer?.includes(option)}
                                            onChange={() => {
                                                const updatedAnswers = quiz.answer?.includes(option)
                                                    ? quiz.answer?.filter(
                                                          (ans: string) => ans !== option
                                                      )
                                                    : [...(quiz.answer || []), option];
                                                handleQuizChange(index, 'answer', updatedAnswers);
                                            }}
                                        />
                                    </div>
                                    <DeleteButton
                                        showLeftIcon
                                        className="delete-answer-button"
                                        onButtonClick={() => {
                                            const updatedOptions = [...quiz.options];
                                            updatedOptions.splice(optionIndex, 1);
                                            handleQuizChange(index, 'options', updatedOptions);
                                        }}
                                    />
                                </div>
                            ))}
                            <EditButton
                                buttonText="Add another answer"
                                onButtonClick={() => {
                                    const updatedOptions = [...quiz.options, ''];
                                    handleQuizChange(index, 'options', updatedOptions);
                                }}
                            />
                        </div>
                    )}
                </div>
            ))}
            {quizType && (
                <EditButton
                    buttonText={`Add ${quizType} quiz`}
                    className="edit-button"
                    onButtonClick={handleAddQuiz}
                />
            )}
            {!quizType && (
                <EditButton
                    ref={buttonRef}
                    buttonText="Add quiz"
                    className="edit-button"
                    onButtonClick={handleButtonClick}
                />
            )}
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        style: {
                            width: menuWidth,
                        },
                    },
                }}
            >
                <MenuItem onClick={() => handleQuizTypeChange('multiple-choice')}>
                    Add multiple choice quiz
                </MenuItem>
                <MenuItem onClick={() => handleQuizTypeChange('free-text')}>
                    Add free text quiz
                </MenuItem>
            </Menu>
        </div>
    );
};
