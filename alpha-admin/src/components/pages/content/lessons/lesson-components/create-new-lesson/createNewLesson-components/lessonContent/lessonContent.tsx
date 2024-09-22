import React, { useEffect, useRef, useState } from 'react';
import './lessonContent.scss';
import { UploadButton } from '../../../../../content-components/upload-button/uploadButton';
import { EditButton } from '../../../../../content-components/edit-button/edit-button';
import { Vector } from '../../../../../../../icon/glyps/vector';
import { Checkbox, Menu, MenuItem } from '@mui/material';
import { DeleteButton } from '../../../../../content-components/delete-button/delete-button';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertToHTML } from 'draft-convert';
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
    errors: any; // Accept errors prop for validation
    setErrors:any;
}

export const LessonContent = ({
    screenData,
    setScreenData,
    quizData,
    setQuizData,
    data,
    setData,
    isEditable,
    errors, // Accept errors prop for validation
    setErrors,
}: LessonContentProps) => {

    const dispatch = useAppDispatch();
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error messages
    const [editorStates, setEditorStates] = useState<EditorState[]>([]); // Rich text editor states for each screen
    const [menuWidth, setMenuWidth] = useState<number>(0);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [quizType, setQuizType] = useState<'multiple-choice' | 'free-text' | null>(null);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]); // Array to store local preview URLs
    const [activeQuizIndex, setActiveQuizIndex] = useState<number | null>(null);
    
    // Handle file changes for media uploads (image/video)
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = event.target.files?.[0];
        if (file) {
            const fileType = file.type;
            const fileSize = file.size;
            const isImage = fileType === 'image/jpeg' || fileType === 'image/png';
            const isVideo = fileType === 'video/mp4';

            // Validate file type and size
            if (isImage && fileSize <= 2 * 1024 * 1024) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const updatedScreenData = [...data.screenData];
                    updatedScreenData[index].media = file.name; // Save the file name for now
                    setData({ ...data, screenData: updatedScreenData });
                    setPreviewUrls((prevUrls) => {
                        const newUrls = [...prevUrls];
                        newUrls[index] = reader.result as string; // Set the local preview URL
                        return newUrls;
                    });
                    setErrorMessage(null);
                };
                reader.readAsDataURL(file);
                dispatch(uploadFile(file))
                
                .then((response: any) => {
                    const uploadedImageUrl = response.payload.data.data.url; // Ensure the correct field from the response
                    
                    // Update the final uploaded image URL in the state
                    setData((prevState: any) => ({
                        ...prevState,
                        coverImage: uploadedImageUrl
                    }));
                    
                    // Clear any cover image errors
                    setErrors((prevErrors: any) => ({
                        ...prevErrors,
                        coverImage: ''
                    }));
                    
                })
                .catch(() => {
                    setErrors((prevErrors: any) => ({
                        ...prevErrors,
                        coverImage: 'Upload failed. Please try again.'
                    }));
                })
                .finally(() => {
                 //   URL.revokeObjectURL(prevUrls); // Clean up after uploading
                });
            } else if (isVideo && fileSize <= 100 * 1024 * 1024) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const updatedScreenData = [...data.screenData];
                    updatedScreenData[index].media = file.name; // Save the file name for now
                    setData({ ...data, screenData: updatedScreenData });
                    setPreviewUrls((prevUrls) => {
                        const newUrls = [...prevUrls];
                        newUrls[index] = reader.result as string; // Set the local preview URL
                        return newUrls;
                    });
                    setErrorMessage(null);
                };
                reader.readAsDataURL(file);
            } else {
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

    const handleEditorChange = (newState: any, index: number) => {
        const updatedEditorStates = [...editorStates];
        updatedEditorStates[index] = newState;
        setEditorStates(updatedEditorStates);

        const updatedScreenData = [...data.screenData];
        updatedScreenData[index].content = convertToHTML(newState.getCurrentContent());
        setData({ ...data, screenData: updatedScreenData });
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
        setScreenData(updatedScreenData);
        setData({ ...data, screenData: updatedScreenData });
        setPreviewUrls((prevUrls) => [...prevUrls, '']); // Add a placeholder for the new screen
    };

    const handleQuizTypeChange = (type: 'multiple-choice' | 'free-text') => {
        setQuizType(type);
        setActiveQuizIndex(null);
        setAnchorEl(null);
    };

    const handleAddQuiz = () => {
        if (!quizType) return;

        const newQuiz = {
            quizName: '',
            userInstructions: '',
            question: '',
            type: quizType,
            options: quizType === 'multiple-choice' ? [''] : undefined, // Start with one empty option for multiple-choice
            answer: quizType === 'multiple-choice' ? [] : undefined, // Start with no answers
        };
        const updatedQuizData = [...data.quizData, newQuiz];
        setData({ ...data, quizData: updatedQuizData });
        setQuizType(null); // Reset quiz type
    };

    const handleRemoveQuiz = (index: number) => {
        const updatedQuizData = data.quizData.filter((_: any, i: number) => i !== index);
        setData({ ...data, quizData: updatedQuizData });
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

    return (
        <div className="lesson-content">
            <h3>
                Lesson content <Vector />
            </h3>
            {data.screenData.map((screen: any, index: any) => (
                <div
                    key={index}
                    className={`screen ${errors[`screen-${index}`] ? 'error-border' : ''}`}
                >
                    <h3>Screen {index + 1}</h3>

                    {/* Cover Image or Video Section */}
                    <div className="cover-image-section">
                        <label htmlFor="cover-image" className="cover-image-label">
                            Image or Video <span style={{ color: 'red' }}>*</span>
                        </label>
                        <div className="cover-image-hint">
                            Image: JPG, PNG, max 2MB; Video: MP4, max 100MB
                        </div>

                        {!previewUrls[index] ? (
                            <UploadButton
                                showLeftIcon
                                buttonText="Upload media"
                                onButtonClick={() => {}}
                                data={data}
                                setData={setData}
                                handleFileChange={(e) => handleFileChange(e, index)}
                            />
                        ) : (
                            <div className="uploaded-image-preview">
                                {screen.media && (screen.media.endsWith('.mp4') ? (
                                    <video src={previewUrls[index]} className="uploaded-video" controls />
                                ) : (
                                    <img
                                        src={previewUrls[index]}
                                        alt="Uploaded media preview"
                                        className="uploaded-image"
                                    />
                                ))}
                                <div className="edit-image-section">
                                    <button
                                        onClick={() => {
                                            const updatedScreenData = [...data.screenData];
                                            updatedScreenData[index].media = ''; // Clear the media URL
                                            setData({ ...data, screenData: updatedScreenData });
                                            setPreviewUrls((prevUrls) => {
                                                const newUrls = [...prevUrls];
                                                newUrls[index] = ''; // Clear the local preview URL
                                                return newUrls;
                                            });
                                        }}
                                        className="remove-uploaded-image-button"
                                    >
                                        Edit image
                                    </button>
                                </div>
                            </div>
                        )}

                        {errorMessage && (
                            <div
                                className="error-message"
                                style={{ color: 'red', marginTop: '5px' }}
                            >
                                {errorMessage}
                            </div>
                        )}
                    </div>

                    {/* Subtitle Section */}
                    <div className="subtitle-section input-field">
                        <label>
                            Subtitle <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter lesson subtitle"
                            value={data.screenData[index]?.subtitle || ''}
                            className={`input ${errors[`subtitle-${index}`] ? 'error-border' : ''}`}
                            onChange={(e) => {
                                const updatedScreenData = [...data.screenData];
                                updatedScreenData[index].subtitle = e.target.value;
                                setData({ ...data, screenData: updatedScreenData });
                            }}
                            required
                        />
                        {errors[`subtitle-${index}`] && (
                            <div className="error-message">{errors[`subtitle-${index}`]}</div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="content-section input-field">
                        <label>
                            Content <span style={{ color: 'red' }}>*</span>
                        </label>
                        <div className={`editor-wrapper ${errors[`content-${index}`] ? 'error-border' : ''}`}>
                            <Editor
                                editorState={editorStates[index]}
                                toolbarClassName="toolbarClassName"
                                wrapperClassName="wrapperClassName"
                                editorClassName="custom-editor"
                                onEditorStateChange={(newState) => handleEditorChange(newState, index)}
                            />
                        </div>
                        {errors[`content-${index}`] && (
                            <div className="error-message">{errors[`content-${index}`]}</div>
                        )}
                    </div>
                </div>
            ))}

            {/* Add another screen button */}
            <EditButton
                buttonText="Add another screen"
                onButtonClick={handleAddScreen}
                className="edit-button"
            />

            {/* Quizzes Section */}
            <h3>
                Quizzes <Vector />
            </h3>
            {data.quizData.map((quiz: any, index: number) => (
                <div key={index} className="quiz-content screen">
                    <div className="quiz-header">
                        <h4>{quiz.type === 'multiple-choice' ? 'Multiple-choice Quiz' : 'Free-text Quiz'}</h4>
                        <DeleteButton
                            showLeftIcon
                            buttonText="Remove quiz"
                            onButtonClick={() => handleRemoveQuiz(index)}
                        />
                    </div>

                    <div className="quiz-name input-field">
                        <label>Quiz Name</label>
                        <input
                            type="text"
                            placeholder="Enter quiz name"
                            value={quiz.quizName || ''}
                            className={errors[`quizName-${index}`] ? 'error-border' : ''}
                            onChange={(e) => {
                                const updatedQuizData = [...data.quizData];
                                updatedQuizData[index].quizName = e.target.value;
                                setData({ ...data, quizData: updatedQuizData });
                            }}
                            required
                        />
                        {errors[`quizName-${index}`] && (
                            <div className="error-message">{errors[`quizName-${index}`]}</div>
                        )}
                    </div>

                    <div className="quiz-question input-field">
                        <label>Quiz Question</label>
                        <input
                            type="text"
                            placeholder="Enter quiz question"
                            value={quiz.question || ''}
                            className={errors[`question-${index}`] ? 'error-border' : ''}
                            onChange={(e) => {
                                const updatedQuizData = [...data.quizData];
                                updatedQuizData[index].question = e.target.value;
                                setData({ ...data, quizData: updatedQuizData });
                            }}
                            required
                        />
                        {errors[`question-${index}`] && (
                            <div className="error-message">{errors[`question-${index}`]}</div>
                        )}
                    </div>
                    <div className="user-instruction input-field">
                        <label>
                            User instruction <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter User instruction"
                            value={quiz.userInstructions || ''}
                            className={errors[`userInstructions-${index}`] ? 'error-border' : ''}
                            onChange={(e) => {
                                const updatedQuizData = [...data.quizData];
                                updatedQuizData[index].userInstructions = e.target.value;
                                setData({ ...data, quizData: updatedQuizData });
                            }}
                            required
                        />
                        {errors[`userInstructions-${index}`] && (
                            <div className="error-message">{errors[`userInstructions-${index}`]}</div>
                        )}
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
                                            const updatedQuizData = [...data.quizData];
                                            updatedQuizData[index].options = updatedOptions;
                                            setData({ ...data, quizData: updatedQuizData });
                                        }}
                                        required
                                    />
                                    <Checkbox
                                        checked={quiz.answer?.includes(option)}
                                        onChange={() => {
                                            const updatedAnswers = quiz.answer?.includes(option)
                                                ? quiz.answer?.filter((ans: string) => ans !== option)
                                                : [...(quiz.answer || []), option];

                                            const updatedQuizData = [...data.quizData];
                                            updatedQuizData[index].answer = updatedAnswers;
                                            setData({ ...data, quizData: updatedQuizData });
                                        }}
                                    />
                                    </div>
                                    <DeleteButton
                                        showLeftIcon
                                        className="delete-answer-button"
                                        onButtonClick={() => {
                                            const updatedOptions = [...quiz.options];
                                            updatedOptions.splice(optionIndex, 1);
                                            const updatedQuizData = [...data.quizData];
                                            updatedQuizData[index].options = updatedOptions;
                                            setData({ ...data, quizData: updatedQuizData });
                                        }}
                                    />
                                    {errors[`option-${index}-${optionIndex}`] && (
                                        <div className="error-message">
                                            {errors[`option-${index}-${optionIndex}`]}
                                        </div>
                                    )}
                                </div>
                            ))}

                            <EditButton
                                buttonText="Add another answer"
                                onButtonClick={() => {
                                    const updatedOptions = [...quiz.options, ''];
                                    const updatedQuizData = [...data.quizData];
                                    updatedQuizData[index].options = updatedOptions;
                                    setData({ ...data, quizData: updatedQuizData });
                                }}
                            />
                            {errors[`options-${index}`] && (
                                <div className="error-message">{errors[`options-${index}`]}</div>
                            )}
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
                    Add multiple-choice quiz
                </MenuItem>
                <MenuItem onClick={() => handleQuizTypeChange('free-text')}>
                    Add free-text quiz
                </MenuItem>
            </Menu>
        </div>
    );
};
