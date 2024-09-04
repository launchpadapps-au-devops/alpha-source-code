import React, { useEffect, useState } from 'react';
import './lessonInformation.scss';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../../../app/hooks';
import { fetchLessonByIdThunk } from '../lessonsSlice';

export interface LessonProps {
    lessonData: any;
    setLessonData: any;
}

const LessonInformation: React.FC<LessonProps> = ({ lessonData, setLessonData }) => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const [lesson, setLesson] = useState([]);

    useEffect(() => {
        dispatch(fetchLessonByIdThunk(id)).then((res: any) => {
            setLesson(res.payload.data);
        });
        console.log('lesson', lesson);
    }, []);
    return (
        <div className="lesson-information">
            <div className="lesson-header">
                <h2>Lesson information</h2>
            </div>
            <div className="lesson-details">
                <div className="lesson-item full-width">
                    <label>Lesson name</label>
                    <div className="lesson-value">{lessonData.name}</div>
                </div>
                <div className="lesson-grid">
                    <div className="lesson-item">
                        <label>Lesson code</label>
                        <div className="lesson-value">{lessonData.lessonCode}</div>
                    </div>
                    <div className="lesson-item">
                        <label>Lesson duration</label>
                        <div className="lesson-value">{lessonData.duration} mins</div>
                    </div>
                    <div className="lesson-item">
                        <label>Lesson category</label>
                        <div className="lesson-value">{lessonData.category.name}</div>
                    </div>
                    <div className="lesson-item">
                        <label>Points allocation</label>
                        <div className="lesson-value">{lessonData.points}</div>
                    </div>
                </div>
                <div className="lesson-item full-width">
                    <label>Internal notes</label>
                    <div className="lesson-value">{lessonData.internalNotes}</div>
                </div>
            </div>
        </div>
    );
};

export default LessonInformation;
