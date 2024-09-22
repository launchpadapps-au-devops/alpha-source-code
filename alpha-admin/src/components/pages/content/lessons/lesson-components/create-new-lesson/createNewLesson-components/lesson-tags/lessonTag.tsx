import React, { useState, useEffect } from 'react';
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
    errors?: Record<string, string>; // Optional errors object
    setErrors?: (errors: any) => void;
}

export const LessonTags = ({ data, setData, isEditMode, errors = {} , setErrors }: LessonTagsProps) => {
    
    useEffect(() => {
        console.log('Errors state updated:', errors);
    }, [errors]);

    
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
        'Ethnicity': [
            'Australian',
            'Aboriginal',
            'Asian',
            'British',
            'Caucasian',
            'Polynesians',
            'Middle Eastern',
            'African',
            'Latin',
            'Other',
            'All'
        ],
        'Leisure Preferences': [
            'Cooking',
            'Eating',
            'Socialising',
            'Family time',
            'Solitude',
            'Outdoors',
            'Indoors',
            'Other',
            'All'
        ],
        'Dietary Restrictions': [
            'Gluten-free',
            'Lactose-free',
            'Nut free',
            'Seafood allergy',
            'Egg allergy',
            'No allergy',
            'Other',
            'All'
        ],
        'Physical Limitation': [
            'None',
            'Some limitation',
            'Moderately limited',
            'Significantly limited',
            'Completely limited',
            'All'
        ],
        'Physical Limitation- Follow up': [
            'Head',
            'Upper limb',
            'Torso',
            'Lower back',
            'Hips',
            'Knees',
            'Lower limb',
            'Other',
            'All'
        ],
        'Unhealthy Eating Habits': ['0', '1', '2', '3', '4', '5+', 'All'],
        'Motivation to Change': [
            'Very unmotivated',
            'Somewhat unmotivated',
            'Neutral',
            'Somewhat motivated',
            'Very motivated',
            'All'
        ],
        'Goals/Motivators': [
            "Family's advice",
            "Doctor's advice",
            'Lose weight',
            'Want to be healthier',
            'Want more energy',
            'Want to live longer',
            'Pre-diabetic',
            'Fear of illness',
            'Fear of illness 2',
            'Decrease spending',
            'Other',
            'All'
        ],
        'Young Dependents': ['0 kids', '1 kid', '2 kids', '3 kids', '4 kids+', 'All'],
        'Adult Dependents': ['0', '1', '2+', 'All'],
    };

    // Function to validate if all required tags have selections
    const validateTags = () => {
        const validationErrors: Record<string, string> = {};
        tags.forEach((tag) => {
            const selectedOptions = data.lessonTags.find(
                (tagObj: { [key: string]: string[] }) => tagObj[tag] && tagObj[tag].length > 0
            );
            if (!selectedOptions) {
                validationErrors[`tag-${tag}`] = `${tag} is required`;
            }
        });
        return validationErrors;
    };

    // Optional: UseEffect to trigger validation on mount if needed
    useEffect(() => {
        const errors = validateTags();
        if (Object.keys(errors).length > 0) {
            console.log("Validation failed", errors);
        }
    }, [data]);

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
                            <>
                                <Dropdown
                                    label={tag}
                                    options={optionsMap[tag]} // Passing string array options
                                    setData={setData}
                                    isEditMode={isEditMode}
                                    data={data}
                                    className={errors[`tag-${tag}`] ? 'error-border' : ''}
                                    setErrors={setErrors} // Pass the setErrors function
                                />
                                {/* Display validation error */}
                                {errors[`tag-${tag}`] && (
                                    <div className="error-message">{errors[`tag-${tag}`]} {"errors"}</div>
                                )}
                            </>
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
