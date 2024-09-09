import React from 'react';
import './lessonTag.scss';
import Dropdown from './dropdown/dropDown';

// Define a type for the available tags
type Tag =
    | 'Ethnicity'
    | 'Leisure Preferences'
    | 'Dietary Restrictions'
    | 'Physical Limitation'
    | 'Physical Limitation- Follow up'
    | 'Unhealthy Eating Habits'
    | 'Motivation to Change'
    | 'Goals/Motivators'
    | 'Young Dependents'
    | 'Adult Dependents';

interface LessonTagsProps {
    data: any;
    setData: any;
    isEditMode?: boolean;
}

export const LessonTags = ({ data, setData, isEditMode }: LessonTagsProps) => {
    const tags: Tag[] = [
        'Ethnicity',
        'Leisure Preferences',
        'Dietary Restrictions',
        'Physical Limitation',
        'Physical Limitation- Follow up',
        'Unhealthy Eating Habits',
        'Motivation to Change',
        'Goals/Motivators',
        'Young Dependents',
        'Adult Dependents',
    ];

    // Simplified optionsMap with string arrays
    const optionsMap: Record<Tag, string[]> = {
        Ethnicity: [
            'australian',
            'aboriginal',
            'asian',
            'british',
            'caucasian',
            'polynesians',
            'middle eastern',
            'african',
            'Latin',
            'other',
            'all'
        ],
        'Leisure Preferences': [
            'cooking',
            'eating',
            'socialising',
            'family time',
            'solitude',
            'outdoors',
            'Indoors',
            'other',
            'all'
        ],
        'Dietary Restrictions': [
            'gluten-free',
            'lactose-free',
            'nut free',
            'seafood allergy',
            'egg allergy',
            'no allergy',
            'other',
            'all'
        ],
        'Physical Limitation': [
            'none',
            'some limitation',
            'moderately limited',
            'significantly limited',
            'completely limited',
            'all'
        ],
        'Physical Limitation- Follow up': [
            'head',
            'upper limb',
            'torso',
            'lower back',
            'hips',
            'knees',
            'lower limb',
            'other',
            'all'
        ],
        'Unhealthy Eating Habits': ['0', '1', '2', '3', '4', '5+', 'all'],
        'Motivation to Change': [
            'very unmotivated',
            'somewhat unmotivated',
            'neutral',
            'somewhat motivated',
            'very motivated',
            'all'
        ],
        'Goals/Motivators': [
            "family's advice",
            "doctor's advise",
            "lose weight",
            "want to be healthier",
            "want more energy",
            "want to live longer",
            "pre-diabetic",
            "fear of illness",
            "fear of illness 2",
            "decrease spending",
            'other',
            'all'
        ],
        'Young Dependents': ['0 kids', '1 kid', '2 kids', '3 kids', '4 kids+', 'all'],
        'Adult Dependents': ['0', '1', '2+', 'all'],
    };

    return (
        <div className="lesson-tags-container">
            <h2 className="lesson-tags-header">Lesson tags</h2>
            <div className="lesson-tags">
                {tags.map((tag) => (
                    <div key={tag} className="lesson-tag">
                        <div className="lesson-tag-header">
                            <span>{tag}</span>
                        </div>
                        {optionsMap[tag] ? (
                            <Dropdown
                                label={tag}
                                options={optionsMap[tag]} // Passing string array options
                                setData={setData}
                                isEditMode={isEditMode}
                                data={data}
                            />
                        ) : (
                            <p>No options available for {tag}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LessonTags;
