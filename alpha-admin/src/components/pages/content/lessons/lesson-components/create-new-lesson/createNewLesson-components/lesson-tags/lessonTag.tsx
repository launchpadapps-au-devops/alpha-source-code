// src/LessonTags.tsx
import React from 'react';
import './lessonTag.scss';
import Dropdown from './dropdown/dropDown';

export interface LessonTagsProps {
    data: any;
    setData: any;
    isEditMode?: boolean;
}

export const LessonTags = ({ data, setData, isEditMode }: LessonTagsProps) => {
    const tags = [
        'Motivation',
        'Gender',
        'Cultural background',
        'Living situation',
        'Food intolerances',
        'Lifestyle',
        'Physical limitation',
    ];

    const options = [
        'All',
        'Label 1',
        'Label 2',
        'Label 3',
        'Label 4',
        'Label 5',
        'Label 6',
        'Label 7',
        'Label 8',
        'Label 9',
        'Label 10',
    ];

    return (
        <div className="lesson-tags-container">
            <h2 className="lesson-tags-header">Lesson tags</h2>
            <div className="lesson-tags">
                {tags.map((tag) => (
                    <div key={tag} className="lesson-tag">
                        <div className="lesson-tag-header">
                            <span>{tag}</span>
                        </div>
                        <Dropdown
                            label={tag}
                            options={options}
                            setData={setData}
                            isEditMode={isEditMode}
                            data={data}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LessonTags;
